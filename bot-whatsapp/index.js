const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fornecedores = require('./fornecedores.json');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'psof-atendimento' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

function normalizar(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function menu() {
  return [
    'Olá! 👋 Você está falando com o atendimento do *PSOF — Dev’s Breach*.',
    '',
    'Posso ajudar você a encontrar fornecedores industriais.',
    '',
    '*Digite uma opção:*',
    '1️⃣ — Ver todas as categorias',
    '2️⃣ — Buscar por produto ou categoria',
    '3️⃣ — Ver informações do projeto',
    '4️⃣ — Falar com a equipe',
    '',
    'Você também pode escrever diretamente o que procura. Ex.: *materiais elétricos*.'
  ].join('\n');
}

function formatarFornecedor(f) {
  const link = f.url ? `\n🔗 ${f.url}` : '\nℹ️ O link deste fornecedor ainda não foi cadastrado no catálogo.';
  return `*${f.id}. ${f.nome}*\n${f.descricao}${link}`;
}

function buscarFornecedores(termo) {
  const busca = normalizar(termo);
  if (!busca) return [];
  return fornecedores.filter(f => {
    const campos = [f.nome, f.descricao, ...f.palavrasChave].map(normalizar);
    return campos.some(campo => campo.includes(busca) || busca.includes(campo));
  });
}

client.on('qr', qr => {
  console.log('\nEscaneie este QR Code com o WhatsApp que será usado pelo bot:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot PSOF conectado e pronto para receber mensagens.');
});

client.on('authenticated', () => console.log('🔐 WhatsApp autenticado.'));
client.on('auth_failure', msg => console.error('Falha de autenticação:', msg));
client.on('disconnected', reason => console.log('WhatsApp desconectado:', reason));

client.on('message', async message => {
  try {
    // Não responde a grupos, mensagens próprias ou notificações de status.
    if (message.fromMe || message.from.endsWith('@g.us') || message.from === 'status@broadcast') return;

    const textoOriginal = (message.body || '').trim();
    const texto = normalizar(textoOriginal);
    if (!texto) return;

    if (['oi', 'ola', 'olá', 'menu', 'inicio', 'início', 'bom dia', 'boa tarde', 'boa noite', 'ajuda'].some(s => normalizar(s) === texto)) {
      await message.reply(menu());
      return;
    }

    if (['1', 'categorias', 'todos', 'todos fornecedores', 'fornecedores'].includes(texto)) {
      const resposta = ['📚 *Categorias disponíveis no PSOF*', '', ...fornecedores.map(f => `${f.id}️⃣ ${f.nome}`), '', 'Para ver detalhes, envie o nome de uma categoria ou o número dela.'].join('\n');
      await message.reply(resposta);
      return;
    }

    if (texto === '2' || texto.startsWith('buscar ') || texto.startsWith('pesquisar ')) {
      await message.reply('🔎 Escreva o produto ou a categoria que você procura. Ex.: *hidráulica*, *EPIs* ou *ferramentas*.');
      return;
    }

    if (texto === '3' || texto.includes('sobre o projeto') || texto === 'sobre') {
      await message.reply('🏭 *Sobre o PSOF*\nO PSOF é um catálogo acadêmico desenvolvido pela equipe Dev’s Breach, de alunos do SENAI Limeira, para aproximar empresas de fornecedores industriais.\n\n🌐 Consulte o catálogo no site do projeto.');
      return;
    }

    if (texto === '4' || texto.includes('falar com a equipe') || texto.includes('contato') || texto.includes('atendente')) {
      await message.reply('📩 *Fale com a equipe Dev’s Breach*\nE-mail: devsbreach@gmail.com\nTelefone informado no site: (19) 99913-37179.\n\nSe precisar, descreva sua solicitação nesta conversa.');
      return;
    }

    const numero = Number(texto);
    if (Number.isInteger(numero) && numero >= 1 && numero <= fornecedores.length) {
      await message.reply(formatarFornecedor(fornecedores.find(f => f.id === numero)));
      return;
    }

    const encontrados = buscarFornecedores(textoOriginal);
    if (encontrados.length) {
      await message.reply(['Encontrei estas opções para você:', '', ...encontrados.slice(0, 4).map(formatarFornecedor), '', 'Digite *menu* para ver outras opções.'].join('\n\n'));
      return;
    }

    await message.reply('Não encontrei uma categoria exata para essa busca. 🤔\n\nTente palavras como *elétricos*, *hidráulica*, *máquinas*, *ferragens* ou digite *menu* para ver as opções.');
  } catch (error) {
    console.error('Erro ao responder mensagem:', error);
  }
});

client.initialize();
