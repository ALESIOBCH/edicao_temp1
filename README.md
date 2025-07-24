# Memória Digital - Sistema de Lembranças Digitais

## 📖 Sobre o Projeto

O **Memória Digital** é um sistema completo para criação de lembranças digitais personalizadas. O projeto permite que clientes recebam QR codes que, ao serem escaneados, abrem páginas web personalizadas com imagens, textos, músicas de fundo e animações especiais para celebrar momentos importantes.

## 🎯 Funcionalidades

### Templates Disponíveis

1. **Template Romântico** 🌹
   - Ideal para aniversários de namoro e momentos românticos
   - Cores suaves (rosa, dourado)
   - Elementos decorativos românticos
   - Galeria de fotos do casal
   - Timeline da relação
   - Música de fundo romântica

2. **Template Amizade** 🎉
   - Perfeito para aniversários de amigos
   - Cores vibrantes e divertidas
   - Animações de confetti
   - Fatos divertidos sobre a amizade
   - Galeria de momentos especiais
   - Desejos personalizados

3. **Template Profissional** 💼
   - Ideal para reconhecimento de funcionários
   - Design corporativo elegante (azul marinho e dourado)
   - Perfil profissional
   - Conquistas e habilidades
   - Timeline da carreira
   - Valores da empresa

### Funcionalidades dos Templates

- ✅ **Edição de Textos**: Todos os textos são editáveis
- ✅ **Upload de Imagens**: Substituição de imagens por upload
- ✅ **Música de Fundo**: Upload de arquivos de áudio personalizados
- ✅ **Responsivo**: Funciona em desktop e mobile
- ✅ **Animações**: Efeitos visuais e transições suaves
- ✅ **Modo Administrador**: Sistema de edição para customização

## 📁 Estrutura do Projeto

```
digital_memories_deploy/
├── index.html                 # Página principal
├── admin.html                 # Painel de administração
├── template-selector.html     # Seleção de templates
├── css/
│   ├── style.css             # Estilos da página principal
│   ├── admin.css             # Estilos do painel admin
│   └── template-selector.css # Estilos do seletor
├── js/
│   ├── admin.js              # JavaScript do admin
│   └── template-selector.js  # JavaScript do seletor
├── images/                   # Imagens da página principal
├── templates/
│   ├── romantico/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── *.png/jpg         # Imagens do template
│   ├── amizade/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── *.png/jpg         # Imagens do template
│   └── profissional/
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       └── *.png/jpg         # Imagens do template
└── README.md
```

## 🚀 Como Usar

### Para Clientes

1. **Acesse a página principal**: `index.html`
2. **Escolha um template**: Clique em "Escolher Template"
3. **Selecione o template desejado**: Romântico, Amizade ou Profissional
4. **Preencha o formulário**: Dados pessoais e detalhes da lembrança
5. **Aguarde o contato**: Nossa equipe entrará em contato

### Para Administradores

1. **Acesse o painel admin**: `admin.html`
2. **Gerencie templates**: Visualize e edite templates existentes
3. **Gerencie clientes**: Adicione, edite e visualize clientes
4. **Customize templates**: Use o modo de edição para personalizar

### Modo de Edição dos Templates

Para ativar o modo de edição em qualquer template, adicione `?admin=true` na URL:
```
templates/romantico/index.html?admin=true
```

**Funcionalidades do modo de edição:**
- Clique em qualquer texto para editar
- Clique em imagens para fazer upload de novas
- Botão para alterar música de fundo
- Salvar alterações no localStorage

## 🎨 Customização

### Adicionando Novos Templates

1. **Crie uma nova pasta** em `templates/`
2. **Copie a estrutura** de um template existente
3. **Customize o HTML, CSS e JavaScript**
4. **Adicione imagens específicas** do template
5. **Atualize** `template-selector.html` e `admin.html`

### Personalizando Cores e Estilos

Cada template tem seu próprio arquivo CSS com variáveis facilmente customizáveis:

```css
/* Exemplo: Template Romântico */
:root {
    --primary-color: #d81b60;
    --secondary-color: #ffd700;
    --background-gradient: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}
```

## 📱 Responsividade

Todos os templates são totalmente responsivos e funcionam perfeitamente em:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos, Grid, Flexbox, Animações
- **JavaScript ES6+**: Interatividade e funcionalidades
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia
- **LocalStorage**: Persistência de dados

## 🌐 Deploy

### Netlify (Recomendado)

1. **Faça upload** da pasta `digital_memories_deploy`
2. **Configure** o arquivo `netlify.toml` (já incluído)
3. **Defina redirects** no arquivo `_redirects` (já incluído)
4. **Publique** o site

### Outros Provedores

O projeto é compatível com qualquer provedor de hospedagem estática:
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3

## 📋 Checklist de Funcionalidades

### Templates
- ✅ Template Romântico completo
- ✅ Template Amizade completo  
- ✅ Template Profissional completo
- ✅ Modo de edição em todos os templates
- ✅ Upload de imagens funcionando
- ✅ Upload de música funcionando
- ✅ Responsividade em todos os dispositivos

### Sistema de Administração
- ✅ Painel de administração
- ✅ Gerenciamento de templates
- ✅ Gerenciamento de clientes
- ✅ Sistema de configurações

### Páginas do Sistema
- ✅ Página principal (landing page)
- ✅ Seletor de templates
- ✅ Formulário de contato
- ✅ Sistema de notificações

### Funcionalidades Técnicas
- ✅ Animações e transições
- ✅ LocalStorage para persistência
- ✅ Validação de formulários
- ✅ Sistema de modais
- ✅ Navegação intuitiva

## 🎯 Próximos Passos

### Funcionalidades Futuras
- 🔄 **Backend com banco de dados** para persistência real
- 🔄 **Sistema de autenticação** para administradores
- 🔄 **Geração automática de QR codes**
- 🔄 **Sistema de pagamento** integrado
- 🔄 **Editor visual** de templates
- 🔄 **Mais templates** (casamento, formatura, etc.)
- 🔄 **Integração com redes sociais**
- 🔄 **Analytics** de visualizações

### Melhorias Técnicas
- 🔄 **PWA** (Progressive Web App)
- 🔄 **Otimização de performance**
- 🔄 **Testes automatizados**
- 🔄 **CI/CD pipeline**

## 📞 Suporte

Para dúvidas ou suporte técnico:
- 📧 **Email**: suporte@memoriadigital.com
- 💬 **WhatsApp**: (11) 99999-9999
- 🌐 **Site**: https://memoriadigital.netlify.app

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para criar memórias inesquecíveis**

