#include <iostream>
#include <fstream>
#include <string>
using namespace std;

void xorProcess(const string &inputFile, const string &outputFile, const string &key) {
    ifstream in(inputFile, ios::binary);
    ofstream out(outputFile, ios::binary);

    if (!in || !out) {
        cerr << "File error";
        return;
    }

    char ch;
    int keyIndex = 0;
    int keyLength = key.length();

    while (in.get(ch)) {
        ch = ch ^ key[keyIndex];
        out.put(ch);
        keyIndex = (keyIndex + 1) % keyLength;
    }

    in.close();
    out.close();
}

int main(int argc, char* argv[]) {
    if (argc != 5) {
        cerr << "Usage: encoder <mode> <input> <output> <key>";
        return 1;
    }

    string mode = argv[1];
    string inputFile = argv[2];
    string outputFile = argv[3];
    string key = argv[4];

    xorProcess(inputFile, outputFile, key);

    cout << "Success";
    return 0;
}