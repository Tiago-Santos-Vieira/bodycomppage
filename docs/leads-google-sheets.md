# Salvar os leads do quiz numa planilha do Google

O quiz envia e-mail, WhatsApp, perfil, respostas e UTMs para a URL em `LEADS_WEBHOOK_URL` (`src/App.tsx`).
Enquanto ela estiver vazia, o quiz funciona, mas nenhum lead é salvo.

## Passo a passo (uns 5 minutos)

1. Crie uma planilha nova no Google Sheets (ex.: "Leads BodyComp").
2. Menu **Extensões → Apps Script**.
3. Apague o que estiver lá e cole o código abaixo. Salve.
4. **Implantar → Nova implantação** → engrenagem → **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize com sua conta Google e copie a **URL do app da Web** (termina em `/exec`).
6. Cole essa URL em `LEADS_WEBHOOK_URL` no `src/App.tsx`, faça commit e push para a Vercel publicar.
7. Teste: faça o quiz no site e veja se a linha aparece na aba **Leads**.

> Se depois você editar o script, use **Implantar → Gerenciar implantações → editar → Nova versão**, senão a URL continua rodando a versão antiga.

## Código do Apps Script

```js
const HEADERS = [
  'Data', 'Nome', 'E-mail', 'WhatsApp', 'Link WhatsApp', 'Perfil',
  'P1', 'P2', 'P3', 'P4', 'P5', 'P6',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'Página'
];

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

  const d = JSON.parse(e.postData.contents);
  const phone = String(d.phone || '').replace(/\D/g, '');
  // 10-11 dígitos = DDD + número; mais que isso já veio com o 55
  const waPhone = phone.length <= 11 ? '55' + phone : phone;
  const answers = d.answers || [];

  sheet.appendRow([
    new Date(),
    d.name || '',
    d.email || '',
    phone,
    phone ? 'https://wa.me/' + waPhone : '',
    d.profile === 'A' ? 'A - paga software' : 'B - usa planilha',
    answers[0] || '', answers[1] || '', answers[2] || '',
    answers[3] || '', answers[4] || '', answers[5] || '',
    d.utm_source || '', d.utm_medium || '', d.utm_campaign || '',
    d.utm_content || '', d.utm_term || '',
    d.page || ''
  ]);

  return ContentService.createTextOutput('ok');
}
```

## Como usar os leads

- A coluna **Link WhatsApp** abre a conversa direto. Chame cada lead no mesmo dia, de preferência em poucas horas.
- O **Perfil** diz qual argumento usar: **A** = já paga software (fale da economia), **B** = usa planilha (fale do tempo).
- A URL do Apps Script é pública. Se começar a chegar lixo, troque a implantação e a URL.
