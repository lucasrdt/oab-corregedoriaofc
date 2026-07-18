# Script de teste da Edge Function claude-honorarios
# Roda no PowerShell do projeto

$ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dGx0aGJnY3drdGtucXhkc3diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDE1MzcsImV4cCI6MjA4OTM3NzUzN30.xgiLIuYyiU9pEvt9Z7kfTw3dz98SO0ySZFwSxjNf8Uw"

$SUPABASE_URL = "https://yutlthbgcwktknqxdswb.supabase.co"

# Gera um token de usuario fresco a cada execucao (o access_token expira em ~1h)
$TEST_EMAIL = "teste@oabma.com"
$TEST_PASSWORD = Read-Host "Senha do usuario de teste ($TEST_EMAIL)" -AsSecureString
$TEST_PASSWORD_PLAIN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($TEST_PASSWORD)
)

$LOGIN_BODY = @{
    email    = $TEST_EMAIL
    password = $TEST_PASSWORD_PLAIN
} | ConvertTo-Json

$LOGIN_RESULT = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/token?grant_type=password" `
    -Method POST `
    -Headers @{ "apikey" = $ANON_KEY; "Content-Type" = "application/json" } `
    -Body $LOGIN_BODY

$TOKEN = $LOGIN_RESULT.access_token
Write-Host "Token obtido: $($TOKEN.Substring(0,20))..." -ForegroundColor DarkGray

$URL = "$SUPABASE_URL/functions/v1/claude-honorarios"

$HEADERS = @{
    "Authorization" = "Bearer $TOKEN"
    "apikey"        = $ANON_KEY
    "Content-Type"  = "application/json"
}

$PERGUNTAS = @(
    "Qual o valor minimo para uma consulta no escritorio?",
    "Quanto cobrar por uma reclamacao trabalhista de R$ 50.000?",
    "Qual o honorario minimo para um divorcio consensual?",
    "Quanto cobrar por um inventario com patrimonio de R$ 200.000?",
    "Qual o valor minimo para defender alguem no Tribunal do Juri?",
    "Quanto cobrar por uma acao de alimentos?",
    "Qual o honorario para elaborar um contrato simples?",
    "Quanto cobrar por um habeas corpus?",
    "Qual o valor minimo para uma acao de indenizacao de R$ 100.000?",
    "Quais areas do direito estao cobertas na tabela da OAB-MA?"
)

$i = 1
foreach ($PERGUNTA in $PERGUNTAS) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "PERGUNTA $i`: $PERGUNTA" -ForegroundColor Yellow
    Write-Host "============================================" -ForegroundColor Cyan

    $BODY = @{
        mensagem  = $PERGUNTA
        historico = @()
    } | ConvertTo-Json -Depth 3

    try {
        $RESULTADO = Invoke-RestMethod -Uri $URL -Method POST -Headers $HEADERS -Body $BODY
        Write-Host "RESPOSTA:" -ForegroundColor Green
        Write-Host $RESULTADO.resposta
    } catch {
        Write-Host "ERRO: $_" -ForegroundColor Red
    }

    $i++
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Teste concluido - $($PERGUNTAS.Count) perguntas testadas" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
