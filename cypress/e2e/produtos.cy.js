/// <reference types = "cypress"/>
import contrato from '../contratos/produtos.contrato'

describe('Teste de API - Produtos', () => {

  let token
  beforeEach (() =>{
    cy.token('it@qa.com.br', 'teste').then(tkn => {token = tkn})
  });

  it('Deve validar contrato de produtos com sucesso', () => {
    cy.request('produtos').then(response =>{
    return contrato.validateAsync(response.body)
  })
})

  it('Listar Produtos - GET', () => {
      cy.request({
        method: 'GET',
        url: 'produtos'
      }).should((response) => {
        expect(response.status).equal(200)
        expect(response.body).to.have.property('produtos')
    })
  })

  it('Cadastrar Produto - POST', () => {
     
      //let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Iml0QHFhLmNvbS5iciIsInBhc3N3b3JkIjoidGVzdGUiLCJpYXQiOjE3MTQ1MTA4MTMsImV4cCI6MTcxNDUxMTQxM30.ntTawiN4bIfb8Lnkq8H7fY6SwNmQdrTPHtH3byNtVjs"
      //TODO: Criar produto dinamicamente
      let produto =  'Produto EBAC ' + Math.floor(Math.random() * 100)
    
      cy.request ({
        method: 'POST',
        url: 'produtos',
        headers: {authorization: token},
        body: {
     
          "nome": produto,
          "preco": 30,
          "descricao": "mouse",
          "quantidade": 25
        }
      }).should((response) => {
       expect(response.status).equal(201)
       expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      });
  })

  it('Deve validar mensagem de produto cadastrado anteriormente', () => {
    cy.request ({
      method: 'POST',
      url: 'produtos',
      headers: {authorization: token},
      body: {
   
        "nome": 'Produto EBAC 62',
        "preco": 30,
        "descricao": "Cabo USB",
        "quantidade": 25
      }
      // Validar statuscode de erro
      , failOnStatusCode: false

    }).should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).to.equal('Já existe produto com esse nome')
    });
  });
  
  it('Deve validar mensagem de produto cadastrado anteriormente usando comandos customizados', () => {
    cy.cadastrarProduto(token, 'Produto EBAC 62', 30, 'Mouse', 25)
     .should((response) => {
       expect(response.status).equal(400)
       expect(response.body.message).to.equal('Já existe produto com esse nome')
     })
  })
 
 
  it('Deve editar um produto com sucesso', () => {
    let produto =  'Produto EBAC editado ' + Math.floor(Math.random() * 100)
    cy.cadastrarProduto(token, produto, 30, 'Produto ebac editado', 100)
        .then(response=> {
        let id = response.body._id
        cy.request ({
          method: 'PUT',
          url: `produtos/${id}`,
          headers: {authorization: token},
          body: {
         
              "nome": produto,
              "preco": 31,
              "descricao": "Cabo USB EDITADO 04",
              "quantidade": 26
          }
      
          }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body.message).to.equal('Registro alterado com sucesso')
       })
    }) 
  })

   it('Deve deletar um produto com sucesso', ()=> {
    cy.cadastrarProduto(token, 'Produto ebac a ser excluído 01', 100, 'Delete', 50)
      .then(response => {
        let id = response.body._id
        cy.request({
        method: 'DELETE',
        url: `produtos/${id}`,
        headers: {authorization: token}
      }).should(resp => {
        expect(resp.body.message).to.equal('Registro excluído com sucesso')
        expect(resp.status).to.equal(200)
      })
    })
  })
})
