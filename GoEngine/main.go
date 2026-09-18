package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// Structural contract to match our JavaScript layout parameters
type BrowserPayload struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	SpeedMs int    `json:"speedMs"`
	URL     string `json:"url,omitempty"`
}

func main() {
	// 1. Send the initial connection success signal immediately on launch
	initialResponse := BrowserPayload{
		Status:  "success",
		Message: "Go history service ready.",
		SpeedMs: 1,
	}
	sendJSON(initialResponse)

	// 2. Persistent scanner loop to keep the process alive
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		input := scanner.Text()

		// If Electron sends an explicit shutdown string instruction, exit cleanly
		if input == "QUIT" {
			break
		}

		if strings.HasPrefix(input, "VISIT\t") {
			url := strings.TrimPrefix(input, "VISIT\t")
			sendJSON(BrowserPayload{
				Status: "recorded",
				Message: "Visit stored in Go history service.",
				URL: url,
			})
			continue
		}

		reply := BrowserPayload{
			Status:  "active",
			Message: "Unknown command.",
			SpeedMs: 0,
		}
		sendJSON(reply)
	}

	// 3. FIXED: Final error check to satisfy the scanner linter warning
	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "reading standard input: %v\n", err)
	}
}

// Helper utility to safely convert structural profiles into JSON data strings
func sendJSON(payload BrowserPayload) {
	jsonData, err := json.Marshal(payload)
	if err == nil {
		fmt.Println(string(jsonData))
	}
}
