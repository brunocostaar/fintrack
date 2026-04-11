# FinTrack 📈

Bem-vindo ao **FinTrack**, o seu gerenciador financeiro moderno, rápido e seguro. Este projeto foi desenvolvido visando proporcionar uma experiência de usuário excepcional com um design elegante (Next.js) alimentado por uma API robusta e escalável em Java (Spring Boot).

## 🚀 Tecnologias e Arquitetura

O FinTrack é dividido em duas camadas principais orquestradas de forma modular:

### ⚙️ Backend (API RESTful)
- **Java 17** & **Spring Boot 4.0.5**
- **Spring Security 6 & JWT (JSON Web Tokens)**: Arquitetura completamente *stateless* e segura. As interações da API são protegidas via endpoints assíncronos que validam assinaturas JWT.
- **Spring Data JPA & Hibernate**: Camada de persistência segura mapeando as Entidades e relacionamentos relacionais.
- **PostgreSQL**: Banco de dados relacional escolhido para abrigar a integridade dos dados multi-inquilino (*multi-tenant*).
- **Dotenv**: Variáveis de ambiente sensíveis (DB credenciais, Chaves JWT) ficam estritamente isoladas do código fonte.

### 🎨 Frontend (SPA)
- **Next.js (App Router)** & **React 18**
- **Tailwind CSS**: Para a estilização ultrarrápida com design *Glassmorphism* moderno, abraçando cores vibrantes em Dark Mode nativo.
- **Lucide React**: Biblioteca de ícones polida e leve.
- **Recharts**: Geração dinâmica de gráficos financeiros fluidos diretamente no navegador.

---

## 🔐 Status de Segurança
A comunicação entre o Frontend (Porta 3000) e o Backend (Porta 8080) é configurada com cabeçalhos rigorosos de CORS:
- As senhas nunca cruzam o banco de forma pura (Hash Bcrypt de ponta-a-ponta).
- O sistema intercepta o Front-end e injeta dinamicamente Headers de `Authorization`.
- Cada transação financeira é atrelada estritamente ao principal do token logado (`user.getEmail()`). 
- Vazamento de rotas e manipulação de estado local são tratados: acessos suspeitos na interface web emitem um logout instantâneo de segurança `HTTP 403 Forbidden`.

---

## 🛠️ Como rodar o projeto localmente

### Pré-Requisitos
- Java JDK 17+ instalado.
- Node.js (v18+) instalado.
- PostgreSQL rodando localmente (Porta padrāo 5432) com o database `fintrack` criado.

### Passo 1: Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz da pasta `fintrack-backend/fintrack/` com o padrão:
```env
FINTRACKHOST=localhost
FINTRACKDBNAME=fintrack
FINTRACKUSER=seu_usuario_postgres
FINTRACKDBPW=sua_senha
FINTRACK_JWT_SECRET=Uma_Chave_De_No_Minimo_64_Caracteres_Totalmente_Aleatoria_E_Segura
```

### Passo 2: Rodar a API Spring Boot
Via terminal, navegue até a pasta raiz do Backend e execute o wrapper do Maven:
```bash
cd fintrack-backend/fintrack
mvn spring-boot:run
```
*(O banco de dados irá auto-gerar as tabelas utilizando Hibernate)*.

### Passo 3: Rodar o Front-End
Em uma nova tela de terminal, siga para a pasta do frontend e instale as dependências:
```bash
cd fintrack-frontend
npm install
npm run dev
```

Pronto! Acesse o projeto local em `http://localhost:3000`.

---
*Desenvolvido com ☕ e focado em excelência de UI/UX nas finanças.*
