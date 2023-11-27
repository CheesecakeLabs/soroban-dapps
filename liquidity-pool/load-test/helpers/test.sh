#!/bin/bash

# Run your command and capture stderr in a variable
error_output=$(ls test 2> >(cat))

# Check if there was an error
if [ -n "$error_output" ]; then
  # There was an error, you can process the error output
  echo "Error output: $error_output"
else
  # No error, you can continue with your script
  echo "No error occurred: $error_output"
fi

# Sample text
text="
[2m2023-11-01T19:56:26.150051Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 1: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAMAAAAPAAAAB2ZuX2NhbGwAAAAADQAAACDRSg+dQW7M1amvmaIhwRtqV+e6fyyDu9dL+V2fCtFK8AAAAA8AAAAIdHJhbnNmZXIAAAAQAAAAAQAAAAMAAAASAAAAAAAAAAAEKMZFHB6dnekbjia3OKk5Jlkq76+3vQwa3tx08h42IAAAABIAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAAKAAAAAAAAAAAAAAAABfXhAA=="
[2m2023-11-01T19:56:26.150056Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 2: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAIAAAAPAAAABWVycm9yAAAAAAAAAgAAAAEAAAAGAAAAEAAAAAEAAAADAAAADgAAABRjb250cmFjdCBjYWxsIGZhaWxlZAAAAA8AAAAIdHJhbnNmZXIAAAAQAAAAAQAAAAMAAAASAAAAAAAAAAAEKMZFHB6dnekbjia3OKk5Jlkq76+3vQwa3tx08h42IAAAABIAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAAKAAAAAAAAAAAAAAAABfXhAA=="
[2m2023-11-01T19:56:26.150061Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 3: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAIAAAAPAAAABWVycm9yAAAAAAAAAgAAAAEAAAAGAAAADgAAAEBlc2NhbGF0aW5nIGVycm9yIHRvIFZNIHRyYXAgZnJvbSBmYWlsZWQgaG9zdCBmdW5jdGlvbiBjYWxsOiBjYWxs"
[2m2023-11-01T19:56:26.150064Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 4: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAEAAAAPAAAAA2xvZwAAAAAQAAAAAQAAAAMAAAAOAAAAHlZNIGNhbGwgdHJhcHBlZCB3aXRoIEhvc3RFcnJvcgAAAAAADwAAAAh3aXRoZHJhdwAAAAIAAAABAAAABg=="
This is an example error: transaction submission occurred here. 

[2m2023-11-01T19:56:26.150051Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 1: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAMAAAAPAAAAB2ZuX2NhbGwAAAAADQAAACDRSg+dQW7M1amvmaIhwRtqV+e6fyyDu9dL+V2fCtFK8AAAAA8AAAAIdHJhbnNmZXIAAAAQAAAAAQAAAAMAAAASAAAAAAAAAAAEKMZFHB6dnekbjia3OKk5Jlkq76+3vQwa3tx08h42IAAAABIAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAAKAAAAAAAAAAAAAAAABfXhAA=="
[2m2023-11-01T19:56:26.150056Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 2: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAIAAAAPAAAABWVycm9yAAAAAAAAAgAAAAEAAAAGAAAAEAAAAAEAAAADAAAADgAAABRjb250cmFjdCBjYWxsIGZhaWxlZAAAAA8AAAAIdHJhbnNmZXIAAAAQAAAAAQAAAAMAAAASAAAAAAAAAAAEKMZFHB6dnekbjia3OKk5Jlkq76+3vQwa3tx08h42IAAAABIAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAAKAAAAAAAAAAAAAAAABfXhAA=="
[2m2023-11-01T19:56:26.150061Z[0m [31mERROR[0m [2msoroban_cli::log::diagnostic_event[0m[2m:[0m 3: "AAAAAAAAAAAAAAABU+8N3nvtEu9fy1l0NJvDfkIyKfR5upOk5Suj4MY1wW4AAAACAAAAAAAAAAIAAAAPAAAABWVycm9yAAAAAAAAAgAAAAEAAAAGAAAADgAAAEBlc2NhbGF0aW5nIGVycm9yIHRvIFZNIHRyYXAgZnJvbSBmYWlsZWQgaG9zdCBmdW5jdGlvbiBjYWxsOiBjYWxs"
[2m2023-11-01T19:56:26.150064Z[0m [31mERROR[0m [2msoroban"

# Use grep to capture the desired text
if [[ $text =~ "error: transaction submission" ]]; then
  captured_text=$(echo "$text" | grep -o "error: transaction submission.*")
  echo "Captured text: $captured_text"
else
  echo "Text not found."
fi