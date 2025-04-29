#include <iostream>
#include <fstream>
#include <vector>
#include <string>

using namespace std;

// Function to check if the system is in a safe state
bool isSafeState(vector<vector<int>>& allocation, vector<vector<int>>& max, 
                vector<int>& available, int processes, int resources,
                vector<int>& safeSequence) {
    
    // Make working copies of the allocation and available resources
    vector<vector<int>> need(processes, vector<int>(resources, 0));
    vector<int> work = available;
    vector<bool> finish(processes, false);
    
    // Calculate need matrix (need = max - allocation)
    for (int i = 0; i < processes; i++) {
        for (int j = 0; j < resources; j++) {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }
    
    // Print the need matrix
    cout << "Need Matrix:" << endl;
    cout << "   A B C" << endl;
    for (int i = 0; i < processes; i++) {
        cout << "P" << i << " ";
        for (int j = 0; j < resources; j++) {
            cout << need[i][j] << " ";
        }
        cout << endl;
    }
    cout << endl;
    
    // Find a safe sequence
    int count = 0;
    while (count < processes) {
        bool found = false;
        for (int i = 0; i < processes; i++) {
            if (!finish[i]) {
                // Check if all resources for this process can be allocated
                bool canAllocate = true;
                for (int j = 0; j < resources; j++) {
                    if (need[i][j] > work[j]) {
                        canAllocate = false;
                        break;
                    }
                }
                
                // If we can allocate resources to this process
                if (canAllocate) {
                    // Add process to safe sequence
                    safeSequence[count++] = i;
                    // Mark process as finished
                    finish[i] = true;
                    found = true;
                    
                    // Release resources allocated to this process
                    cout << "Process P" << i << " runs to completion." << endl;
                    cout << "Resources released: ";
                    for (int j = 0; j < resources; j++) {
                        work[j] += allocation[i][j];
                        cout << allocation[i][j] << " ";
                    }
                    cout << endl;
                    
                    cout << "Available resources: ";
                    for (int j = 0; j < resources; j++) {
                        cout << work[j] << " ";
                    }
                    cout << endl << endl;
                    
                    // Start over to find the next process
                    break;
                }
            }
        }
        
        // If no process could be found in this iteration, system is not safe
        if (!found) {
            return false;
        }
    }
    
    // If all processes are done, system is in a safe state
    return true;
}

int main() {
    // Define constant values based on the problem statement
    const int resources = 3;  // A, B, C
    const int processes = 5;  // P0, P1, P2, P3, P4
    const int totalResources[3] = {10, 5, 7};  // Total instances of A, B, C
    
    ifstream inputFile("banker_data.txt");
    if (!inputFile.is_open()) {
        cerr << "Error opening file!" << endl;
        return 1;
    }
    
    // Initialize matrices
    vector<vector<int>> allocation(processes, vector<int>(resources));
    vector<vector<int>> max(processes, vector<int>(resources));
    vector<int> available(resources);
    
    // Read allocation matrix
    for (int i = 0; i < processes; i++) {
        for (int j = 0; j < resources; j++) {
            inputFile >> allocation[i][j];
        }
    }
    
    // Read max matrix
    for (int i = 0; i < processes; i++) {
        for (int j = 0; j < resources; j++) {
            inputFile >> max[i][j];
        }
    }
    
    // Read available resources
    for (int i = 0; i < resources; i++) {
        inputFile >> available[i];
    }
    
    // Close file
    inputFile.close();
    
    cout << "Banker's Algorithm for Deadlock Avoidance" << endl;
    cout << "----------------------------------------" << endl << endl;
    
    // Print input data
    cout << "Total Resources:" << endl;
    cout << "A B C" << endl;
    for (int i = 0; i < resources; i++) {
        cout << totalResources[i] << " ";
    }
    cout << endl << endl;
    
    cout << "Available Resources:" << endl;
    cout << "A B C" << endl;
    for (int i = 0; i < resources; i++) {
        cout << available[i] << " ";
    }
    cout << endl << endl;
    
    cout << "Allocation Matrix:" << endl;
    cout << "   A B C" << endl;
    for (int i = 0; i < processes; i++) {
        cout << "P" << i << " ";
        for (int j = 0; j < resources; j++) {
            cout << allocation[i][j] << " ";
        }
        cout << endl;
    }
    cout << endl;
    
    cout << "Maximum Matrix:" << endl;
    cout << "   A B C" << endl;
    for (int i = 0; i < processes; i++) {
        cout << "P" << i << " ";
        for (int j = 0; j < resources; j++) {
            cout << max[i][j] << " ";
        }
        cout << endl;
    }
    cout << endl;
    
    // Check if system is in a safe state
    vector<int> safeSequence(processes);
    bool safe = isSafeState(allocation, max, available, processes, resources, safeSequence);
    
    if (safe) {
        cout << "THE SYSTEM IS IN A SAFE STATE" << endl;
        cout << "Safe Sequence: ";
        for (int i = 0; i < processes; i++) {
            cout << "P" << safeSequence[i];
            if (i < processes - 1) {
                cout << " -> ";
            }
        }
        cout << endl;
    } else {
        cout << "THE SYSTEM IS NOT IN A SAFE STATE" << endl;
    }
    
    return 0;
}
