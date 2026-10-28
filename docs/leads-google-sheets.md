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

  // Aviso por e-mail para o dono da planilha. Fica depois do appendRow: se o e-mail falhar, o lead já está salvo.
  try {
    avisarNovoLead(d, phone, waPhone, answers, ss.getUrl());
  } catch (err) {
    console.error('Falha ao enviar o aviso de lead', err);
  }

  return ContentService.createTextOutput('ok');
}

const PERGUNTAS = ['Pacientes por mês', 'Como organiza hoje', 'O que mais toma tempo', 'Gasto com software', 'Onde investiria', 'Decisão'];
const semLetra = (s) => String(s || '').replace(/^[A-D]\)\s*/, '');
const escapar = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function avisarNovoLead(d, phone, waPhone, answers, planilhaUrl) {
  const nome = d.name || 'Sem nome';
  const respostas = PERGUNTAS.map((p, i) => '<li><b>' + p + ':</b> ' + escapar(semLetra(answers[i])) + '</li>').join('');
  const botao = (href, texto, cor) => '<a href="' + href + '" style="display:inline-block;margin:6px 8px 6px 0;padding:12px 18px;border-radius:999px;background:' + cor + ';color:#fff;text-decoration:none;font-weight:bold">' + texto + '</a>';
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;color:#12201b">' +
    '<h2 style="margin:0 0 8px">Novo lead no quiz 🎉</h2>' +
    '<p style="margin:0 0 4px"><b>' + escapar(nome) + '</b> · ' + escapar(d.profile === 'A' ? 'paga software' : 'usa planilha') + '</p>' +
    '<p style="margin:0 0 12px">WhatsApp: ' + escapar(phone) + ' · E-mail: ' + escapar(d.email) + '</p>' +
    (phone ? botao('https://wa.me/' + waPhone, 'Chamar no WhatsApp', '#25a35a') : '') +
    botao(planilhaUrl, 'Abrir a planilha', '#006c4d') +
    '<ul style="padding-left:18px">' + respostas + '</ul>' +
    '<p style="color:#5c6b64;font-size:13px">Anúncio: ' + escapar(d.utm_content || 'sem UTM') + ' · ' + escapar(d.utm_term || '') + '</p>' +
    '</div>';
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: '🔔 Novo lead: ' + nome + ' (' + semLetra(answers[0]) + ')',
    htmlBody: html,
    name: 'Quiz BodyComp'
  });
}

// Rode esta função no editor (botão Executar) para receber um e-mail de teste sem mexer na planilha
function testarAviso() {
  avisarNovoLead(
    { name: 'Teste do aviso', email: 'teste@exemplo.com', profile: 'B', utm_content: 'teste manual' },
    '73999990000', '5573999990000',
    ['A) 1 a 10 pacientes.', 'A) No WhatsApp e no papel.', 'B) Montar o cardápio do zero.', 'A) R$ 0.', 'A) Tráfego pago.', 'A) Trocaria hoje mesmo.'],
    SpreadsheetApp.getActiveSpreadsheet().getUrl()
  );
}
```

> O aviso vai para o e-mail da conta dona da planilha. Ao colar esta versão, o Google pede autorização para "enviar e-mail como você".
> Publique sempre em **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**. Uma implantação nova muda a URL e o quiz para de salvar os leads.

## Como usar os leads

- A coluna **Link WhatsApp** abre a conversa direto. Chame cada lead no mesmo dia, de preferência em poucas horas.
- O **Perfil** diz qual argumento usar: **A** = já paga software (fale da economia), **B** = usa planilha (fale do tempo).
- A URL do Apps Script é pública. Se começar a chegar lixo, troque a implantação e a URL.
