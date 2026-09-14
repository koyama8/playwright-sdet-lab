@web @authentication
Feature: Autenticação Web
  Como usuário do Playwright Lab
  Quero realizar autenticação no sistema
  Para acessar as funcionalidades protegidas

  @CT_WEB_AUTH_001 @smoke @positive
  Scenario: CT-WEB-AUTH-001 - Realizar login com credenciais válidas
    Given que o usuário está na página de login
    When o usuário informa credenciais válidas
    And clica no botão "Entrar"
    Then o usuário deve ser direcionado para o dashboard e visualizar sua identificação no sistema

  @CT_WEB_AUTH_002 @negative
  Scenario: CT-WEB-AUTH-002 - Não realizar login com credenciais inválidas
    Given que o usuário está na página de login
    When o usuário informa credenciais inválidas
    And clica no botão "Entrar"
    Then o usuário deve permanecer na página de login e visualizar a mensagem de credenciais inválidas

  @CT_WEB_AUTH_003 @session @negative
  Scenario: CT-WEB-AUTH-003 - Expirar sessão após dez minutos de inatividade
    Given que o usuário está autenticado no sistema
    When o usuário permanece sem realizar nenhuma atividade
    And o tempo limite de dez minutos da sessão é atingido
    Then o usuário deve ser redirecionado para a página de login e visualizar a notificação de sessão expirada
