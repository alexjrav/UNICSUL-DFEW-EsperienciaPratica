// Máscara para campos do formulário
function aplicarMascaras() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    // Máscara para CPF
    IMask(cpfInput, {
        mask: '000.000.000-00'
    });

    // Máscara para telefone
    IMask(telefoneInput, {
        mask: '(00) 00000-0000'
    });

    // Máscara para CEP
    IMask(cepInput, {
        mask: '00000-000'
    });
}

// Buscar endereço pelo CEP
async function buscarCep(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        document.getElementById('endereco').value = data.logradouro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;

        // Feedback visual de sucesso
        mostrarMensagem('Endereço encontrado com sucesso!', 'sucesso');
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        mostrarMensagem('CEP não encontrado. Por favor, verifique.', 'erro');
    }
}

// Sistema de feedback visual
function mostrarMensagem(texto, tipo) {
    alert(texto);
}

// Validação do formulário
function validarFormulario(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData);

    // Validações básicas
    if (!validarCPF(dados.cpf)) {
        mostrarMensagem('CPF inválido!', 'erro');
        return;
    }

    if (!validarIdade(dados.data_nasc)) {
        mostrarMensagem('É necessário ter pelo menos 18 anos!', 'erro');
        return;
    }

    // Salvar dados no localStorage
    salvarCadastro(dados);
    
    // Feedback de sucesso
    mostrarMensagem('Cadastro realizado com sucesso!', 'sucesso');
    form.reset();
}

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Validação de idade
function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade >= 18;
}

// Gerenciamento de dados no localStorage
function salvarCadastro(dados) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros') || '[]');
    cadastros.push({
        ...dados,
        id: Date.now(),
        dataCadastro: new Date().toISOString()
    });
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar máscaras
    aplicarMascaras();

    // Event Listeners
    const form = document.querySelector('form');
    form.addEventListener('submit', validarFormulario);

    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            buscarCep(cep);
        }
    });
});