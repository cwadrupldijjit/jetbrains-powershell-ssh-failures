function prompt {
    $prompt = Write-Prompt "`n$PWD  ("
    $prompt += Write-Prompt "Docker" -ForegroundColor 0x7f00ff
    $prompt += Write-Prompt ")`n"
    
    "$prompt> "
}
