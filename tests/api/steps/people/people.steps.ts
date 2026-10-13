import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/api.fixture';

const { When, Then } = createBdd(test);

When('envio uma requisição GET para o endpoint de pessoas', async () => {});

When('recebo a resposta da consulta de pessoas', async () => {});

Then('a API deve retornar status 200 com a lista de pessoas cadastradas', async () => {});
