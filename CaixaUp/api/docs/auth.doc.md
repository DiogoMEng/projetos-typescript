## Realizar Login

Rota: (POST) /login

|                            Cenários                            | Status | Situação do Teste |
|                               :--                              |   :--  |        :--        |
| Retornar um token JWT válido ao receber credenciais corretas   |   200  |         OK        |
| Retornar os dados do usuário (sem a senha) após o login        |   200  |      PENDENTE     |
| Retornar erro se o e-mail não existir                          |   401  |      PENDENTE     |
| Retornar um erro se o serviço do token estiver fora do ar      |   503  |      PENDENTE     |
| Retornar um erro/exceção quando o usuário não for encontrado   |   401  |         OK        |
| Retornar um erro quando a senha não coincidir com a registrada |   401  |         OK        |