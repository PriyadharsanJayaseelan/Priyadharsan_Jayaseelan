#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <semaphore.h>
#include <fcntl.h>
#include <sys/shm.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <pthread.h>

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

void *consumer_thread(void *arg) {
    printf("CONSUMER: Starting consumption of %d items\n", NUM_ITEMS);
    
    for (int i = 0; i < NUM_ITEMS; i++) {
        // Wait if table is empty
        sem_wait(full);
        
        // Acquire mutex
        sem_wait(mutex);
        
        // Consume item
        int item = shared_table->buffer[shared_table->out];
        printf("Consumer: Consumed item %d from position %d\n", 
               item, shared_table->out);
        
        // Update circular buffer positions
        shared_table->out = (shared_table->out + 1) % TABLE_SIZE;
        
        // Release mutex
        sem_post(mutex);
        
        // Signal that a slot is now empty
        sem_post(empty);
        
        // Simulate consumption time
        sleep(2);
    }
    
    printf("CONSUMER: Finished consuming %d items\n", NUM_ITEMS);
    return NULL;
}

int main() {
    // Open shared memory
    int shm_fd = shm_open(SHM_NAME, O_RDWR, 0666);
    if (shm_fd == -1) {
        perror("shm_open failed");
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
    
    // Open existing semaphores
    mutex = sem_open(MUTEX_NAME, 0);
    empty = sem_open(EMPTY_NAME, 0);
    full = sem_open(FULL_NAME, 0);
    
    if (mutex == SEM_FAILED || empty == SEM_FAILED || full == SEM_FAILED) {
        perror("Semaphore opening failed");
        exit(1);
    }
    
    // Create consumer thread
    pthread_t consumer;
    pthread_create(&consumer, NULL, consumer_thread, NULL);
    
    // Wait for consumer thread to complete
    pthread_join(consumer, NULL);
    
    // Clean up
    munmap(shared_table, sizeof(SharedTable));
    close(shm_fd);
    
    // Close semaphores (do not unlink in consumer)
    sem_close(mutex);
    sem_close(empty);
    sem_close(full);
    
    return 0;
}
