# Movie Application

## Descrição
Este projeto é uma aplicação full-stack para gerenciamento e visualização de filmes. Desenvolvida com .NET 7.0 e React, a aplicação oferece uma integração completa com a API do The Movie Database (TMDB), permitindo aos usuários explorar filmes, gerenciar favoritos e manter uma lista personalizada de filmes. Além disso, inclui funcionalidades de autenticação e scroll infinito para uma experiência de usuário fluida e moderna.

## Funcionalidades

- **Exibição de Filmes**: Consome a API do TMDB para exibir informações sobre filmes.
- **Controle de Favoritos**: Permite que os usuários adicionem e removam filmes dos favoritos.
- **Exibição de Favoritos**: Mostra a lista de filmes que o usuário marcou como favoritos.
- **Autenticação JWT**: Inclui login e registro de usuários com autenticação baseada em JSON Web Tokens (JWT).
- **Scroll Infinito**: Carrega novos filmes conforme o usuário rola a página.
- **Banco de Dados**: Comunica-se com um banco de dados SQL Server, com criação e gerenciamento de tabelas usando migrations.

## Configuração

### Variáveis de Ambiente

Certifique-se de criar um arquivo `.env` na raiz do projeto com as seguintes chaves:
- `JWT_KEY`, `JWT_ISSUER_KEY`, `JWT_AUDIENCE_KEY`: Chaves para autenticação JWT.
- `CONNECTION_STRING`: String de conexão para o banco de dados SQL Server.
- `TMDB_API_KEY`: Chave da API do TMDB. [Cadastre-se para obter uma chave](https://developer.themoviedb.org/docs/getting-started).
- `TMDB_URL_BASE`: URL base da API do TMDB.
### Exemplo de Arquivo `.env`

```dotenv
JWT_KEY=your_jwt_secret_key
JWT_ISSUER_KEY=your_jwt_issuer_key
JWT_AUDIENCE_KEY=your_jwt_audience_key
CONNECTION_STRING=Server=localhost;Database=MovieDB;User Id=sa;Password=your_password;
TMDB_API_KEY=your_tmdb_api_key
TMDB_URL_BASE=https://api.themoviedb.org/3
```
### Arquivo `appsettings.json`
O arquivo `appsettings.json` deve estar configurado da seguinte forma para garantir que o projeto utilize as variáveis de ambiente corretamente:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Jwt": {
    "Key": "${JWT_KEY}",
    "Issuer": "${JWT_ISSUER_KEY}",
    "Audience": "${JWT_AUDIENCE_KEY}"
  },
  "ConnectionStrings": {
    "DefaultConnection": "${CONNECTION_STRING}"
  },
  "TMDb": {
    "ApiKey": "${TMDB_API_KEY}",
    "BaseUrl": "${TMDB_URL_BASE}"
  }
}
```

### Instalação

1. Clone o repositório:

   `git clone https://github.com/Almeidaadavid/Movie-Project.git`

2. Navegue até o diretório do projeto:

   `cd Movie-Project`

3. Instale as dependências do backend:

    `cd API/MovieAPI`
    
   `dotnet restore`

4. Instale as dependências do frontend:

   `cd ../movie-app`
   
   `yarn install`

5. Crie o banco de dados e aplique as migrations:

    `cd ../API/MovieAPI`
    
   `dotnet ef database update`
   
### Solução de Problemas Comuns

- **Erro ao rodar migrations**: Certifique-se de que a string de conexão está correta e que o banco de dados está acessível. Verifique também se o banco de dados foi criado corretamente e se as permissões estão configuradas adequadamente.

- **Problemas com dependências do frontend**: Verifique se o Yarn está instalado corretamente e se você está na pasta certa (`movie-app`). Caso o Yarn não esteja instalado, você pode instalá-lo com o comando `npm install -g yarn`. Se ainda enfrentar problemas, tente excluir a pasta `node_modules` e o arquivo `yarn.lock`, e execute `yarn install` novamente.

- **Erros de compilação ou execução**: Certifique-se de que todas as dependências estão atualizadas e que não há conflitos de versão. Verifique também se o arquivo `.env` está configurado corretamente e se todas as variáveis necessárias estão definidas.

- **Problemas com autenticação JWT**: Verifique se as chaves JWT estão corretamente definidas no arquivo `.env` e se são consistentes entre o backend e o frontend. Certifique-se também de que a configuração de autenticação JWT no backend está correta.

### Execução

1. Inicie o backend:

    `cd API/MovieAPI`
   
   `dotnet run`

2. Inicie o frontend:

    `cd ../movie-app`
   
   `yarn start`

## Pacotes Utilizados

### Backend

- **BCrypt.Net-Next**: Utilizado para hash e verificação segura de senhas.
- **dotenv.net**: Para carregar variáveis de ambiente a partir de um arquivo `.env`.
- **Microsoft.AspNetCore.Authentication.JwtBearer**: Configura a autenticação JWT no ASP.NET Core.
- **Microsoft.EntityFrameworkCore**: ORM para interagir com o banco de dados e gerenciar migrations.
- **Microsoft.Extensions.Caching.Memory**: Para controle de cache, utilizado ao compartilhar a lista de favoritos.
- **Newtonsoft.Json**: Biblioteca popular para manipulação de JSON.
- **Swashbuckle.AspNetCore**: Para documentação Swagger da API.

### Solução de Problemas Comuns

- **Cache da lista de favoritos expira após o primeiro uso**: Um possível problema ocorre quando o cache do usuário expira logo após o primeiro acesso à lista compartilhada de favoritos. Isso impede que a lista seja acessada novamente. Para solucionar esse problema de forma mais eficiente, uma alternativa seria armazenar o token de acesso no banco de dados, permitindo que o acesso à lista de favoritos seja controlado por um período definido. Após esse período, uma rotina de limpeza pode ser configurada para remover tokens expirados, garantindo uma melhor experiência do usuário e maior controle sobre os dados compartilhados.

### Frontend

- **react**: Biblioteca para construção de interfaces de usuário.
- **react-dom**: Biblioteca para manipulação do DOM em aplicações React.
- **react-scripts**: Scripts e configurações padrão para aplicações React criadas com Create React App.
- **@mui/material**: Biblioteca de componentes Material-UI.
- **react-icons**: Biblioteca de ícones para React.
- **react-toastify**: Biblioteca para exibição de notificações.
- **typescript**: Superset do JavaScript que adiciona tipos estáticos.
- **web-vitals**: Biblioteca para medir e registrar métricas de performance web.

## Agradecimentos

Obrigado por visualizar o meu projeto! Se você tiver alguma dúvida ou feedback, sinta-se à vontade para entrar em contato.