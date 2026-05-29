import {api} from './api';
export async function apiLogin(d,s){return api('POST','/api/auth/login',{documento:d.replace(/\D/g,''),senha:s});}
export async function apiRegisterCliente(d){if(d.cpf)d.cpf=d.cpf.replace(/\D/g,'');return api('POST','/api/auth/register/cliente',d);}
export async function apiRegisterEmpresa(d){if(d.cnpj)d.cnpj=d.cnpj.replace(/\D/g,'');return api('POST','/api/auth/register/empresa',d);}
export async function apiVerificarEmail(t){return api('GET','/api/auth/verificar/'+t);}
export async function apiReenviarVerificacao(e){return api('POST','/api/auth/reenviar-verificacao',{email:e});}