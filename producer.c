#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <semaphore.h>
#include <fcntl.h>
#include <sys/shm.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <pthread.h>
#include <time.h>
#include <string.h>

#define SHM_NAME "/producer_consumer_shm"
#define MUTEX_NAME "/mutex_semaphore"
#define EMPTY_NAME "/empty_semaphore"
#define FULL_NAME "/full_semaphore"
#define TABLE_SIZE 2
#define NUM_ITEMS 10

typedef struct {
    int buffer[TABLE_SIZE];
    int in;    // Next position to insert
    int out;   // Next position to remove
    int count; // Current number of items
} SharedTable;

SharedTable *shared_table;
sem_t *mutex;
sem_t *empty;
sem_t *full;

void *producer_thread(void *arg) {
    printf("PRODUCER: Starting production of %d items\n", NUM_ITEMS);
    
    for (int i = 0; i < NUM_ITEMS; i++) {
        // Wait if table is full
        sem_wait(empty);
        
        // Acquire mutex
        sem_wait(mutex);
        
        // Produce item
        int item = rand() % 100;  // Random item between 0-99
        shared_table->buffer[shared_table->in] = item;
        printf("Producer: Produced item %d at position %d\n", 
               item, shared_table->in);
        
        // Update circular buffer positions
        shared_table->in = (shared_table->in + 1) % TABLE_SIZE;
        
        // Release mutex
        sem_post(mutex);
        
        // Signal that an item is available
        sem_post(full);
        
        // Simulate production time
        sleep(1);
    }
    
    printf("PRODUCER: Finished producing %d items\n", NUM_ITEMS);
    return NULL;
}

int main() {
    // Seed random number generator
    srand(time(NULL));
    
    // Remove existing shared memory if it exists
    shm_unlink(SHM_NAME);
    
    // Open shared memory
    int shm_fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0666);
    if (shm_fd == -1) {
        perror("shm_open failed");
        exit(1);
    }
    
    // Configure the size of the shared memory
    if (ftruncate(shm_fd, sizeof(SharedTable)) == -1) {
        perror("ftruncate failed");
        exit(1);
    }
    
    // Map the shared memory
    shared_table = mmap(0, sizeof(SharedTable), 
                        PROT_READ | PROT_WRITE, 
                        MAP_SHARED, shm_fd, 0);
    if (shared_table == MAP_FAILED) {
        perror("mmap failed");
        exit(1);
    }
    
    // Initialize shared table
    memset(shared_table, 0, sizeof(SharedTable));
    
    // Remove existing semaphores if they exist
    sem_unlink(MUTEX_NAME);
    sem_unlink(EMPTY_NAME);
    sem_unlink(FULL_NAME);
    
    // Initialize semaphores
    mutex = sem_open(MUTEX_NAME, O_CREAT, 0666, 1);
    empty = sem_open(EMPTY_NAME, O_CREAT, 0666, TABLE_SIZE);
    full = sem_open(FULL_NAME, O_CREAT, 0666, 0);
    
    if (mutex == SEM_FAILED || empty == SEM_FAILED || full == SEM_FAILED) {
        perror("Semaphore creation failed");
        exit(1);
    }
    
    // Create producer thread
    pthread_t producer;
    pthread_create(&producer, NULL, producer_thread, NULL);
    
    // Wait for producer thread to complete
    pthread_join(producer, NULL);
    
    // Clean up
    munmap(shared_table, sizeof(SharedTable));
    close(shm_fd);
    shm_unlink(SHM_NAME);
    
    // Close and unlink semaphores
    sem_close(mutex);
    sem_close(empty);
    sem_close(full);
    sem_unlink(MUTEX_NAME);
    sem_unlink(EMPTY_NAME);
    sem_unlink(FULL_NAME);
    
    return 0;
}
