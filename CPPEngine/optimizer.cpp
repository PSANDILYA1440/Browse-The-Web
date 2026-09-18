#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

// Clean whitespace from strings fast
std::string trim(const std::string& str) {
    size_t first = str.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return "";
    size_t last = str.find_last_not_of(" \t\r\n");
    return str.substr(first, (last - first + 1));
}

int main() {
    // 1. Alert Electron that the native C++ routing bridge is locked and loaded
    std::cout << "{\"status\":\"cpp_ready\",\"msg\":\"C++ URL validator ready\"}" << std::endl;

    std::string inputLine;
    
    // 2. High-speed persistent standard input parsing stream loop
    while (std::getline(std::cin, inputLine)) {
        std::string targetUrl = trim(inputLine);
        
        if (targetUrl == "QUIT") {
            break;
        }

        if (targetUrl.empty()) continue;

        if (targetUrl.rfind("ROUTE\t", 0) == 0) {
            targetUrl = targetUrl.substr(6);
        }

        std::string processedUrl = targetUrl;

        // C++ Smart Router: Intercept spaces or query structures instantly
        if (processedUrl.find(' ') != std::string::npos || processedUrl.find('.') == std::string::npos) {
            // Encode the string data quickly
            std::string encoded = "";
            for (char c : processedUrl) {
                if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
                    encoded += c;
                } else if (c == ' ') {
                    encoded += "%20";
                } else {
                    char buf[4];
                    snprintf(buf, sizeof(buf), "%%%02X", (unsigned char)c);
                    encoded += buf;
                }
            }
            processedUrl = "https://www.google.com/search?q=" + encoded;
        } else {
            // Force strict modern secure transport layering protocol prefixes
            if (processedUrl.rfind("http://", 0) != 0 && processedUrl.rfind("https://", 0) != 0) {
                processedUrl = "https://" + processedUrl;
            }
        }

        // Return the clean, ready URL map straight to Electron instantly
        std::cout << "{\"status\":\"routed\",\"url\":\"" << processedUrl << "\"}" << std::endl;
    }

    return 0;
}
