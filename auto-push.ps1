# Auto-answer drizzle prompts
$process = Start-Process -FilePath "npx" -ArgumentList "drizzle-kit", "push" -PassThru -NoNewWindow -RedirectStandardInput

# Send newlines to accept defaults
Start-Sleep -Seconds 2
$process.StandardInput.WriteLine("")
Start-Sleep -Seconds 1
$process.StandardInput.WriteLine("")
$process.StandardInput.Close()

$process.WaitForExit()