# Bot de WhatsApp do PSOF

Protótipo em Node.js para responder mensagens recebidas, exibir categorias e pesquisar no catálogo de fornecedores do PSOF.

## Requisitos

- Node.js 18 ou superior
- WhatsApp no celular para ler o QR Code na primeira conexão
- Computador ligado enquanto o bot estiver rodando

## Como executar no Windows

1. Instale o Node.js LTS em https://nodejs.org/.
2. Abra o Prompt de Comando ou terminal dentro desta pasta `bot-whatsapp`.
3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o bot:

   ```bash
   npm start
   ```

5. Escaneie o QR Code que aparecer no terminal: WhatsApp > Dispositivos conectados > Conectar dispositivo.
6. Envie `oi` para a conta conectada ao bot e teste o menu.

## Comandos reconhecidos

- `oi` ou `menu`: mostra o menu
- `1` ou `fornecedores`: lista as categorias
- `2`: orienta a busca
- `3`: explica o projeto
- `4`: mostra o contato da equipe
- Nome de categoria/produto: pesquisa no catálogo
- Número de 1 a 8: mostra a categoria correspondente

## Atualizar o catálogo

Edite `fornecedores.json`. Cada item possui nome, descrição, palavras-chave e URL. Use `null` no campo `url` quando ainda não houver um link confirmado. Reinicie o bot depois de alterar o arquivo.

## Observações importantes

- Este é um protótipo para desenvolvimento e demonstração. Ele usa `whatsapp-web.js`, que controla o WhatsApp Web e não é a API oficial do WhatsApp; a conexão pode parar ou exigir novo pareamento e esse tipo de automação pode não ser adequado para produção.
- Para um serviço público/comercial, considere a WhatsApp Business Platform (Cloud API) oficial, com configuração de Meta Business e webhook.
- O bot responde apenas a mensagens diretas recebidas e ignora grupos. Não envie mensagens em massa.
- Algumas categorias do site ainda não têm link real de fornecedor; o bot informa isso em vez de inventar endereços.
- A página do site é estática; este bot lê os dados de `fornecedores.json`. Para manter site e bot sincronizados automaticamente, o próximo passo seria usar um arquivo de dados comum ou uma API.
