#include <iostream>
#include <fstream>
#include <thread>

void runCommand1()
{
    int returnValue = system("node server.js");
    std::cout << "The return value1 is " << returnValue << std::endl;
}
int main()
{
    char c;
    std::thread t1(runCommand1);
    // std::thread t2(runCommand2);

    t1.join();
    // t2.join();

    std::cout << "Enter any key to quit" << std::endl;
    std::cin >> c;

    return 0;
}