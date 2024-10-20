document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userIdParaEditar');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        window.location.href = 'login.html';
    }

    // Função para carregar dados do usuário
    async function carregarDadosUsuario() {
        try {
            const response = await fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('name').value = data.user.name;
                document.getElementById('email').value = data.user.email;
            } else {
                throw new Error('Erro ao carregar dados do usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById('mensagemErro').textContent = 'Erro ao carregar os dados do usuário.';
            document.getElementById('mensagemErro').classList.remove('d-none');
        }
    }

    // Função para salvar alterações
    document.getElementById('editarUsuarioForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;
        const confirmacaoSenha = document.getElementById('password_confirmation').value;

        const dadosUsuario = {
            name: nome || undefined,
            email: email || undefined,
            password: senha || undefined,
            password_confirmation: confirmacaoSenha || undefined,
        };

        try {
            const response = await fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosUsuario),
            });

            if (response.ok) {
                document.getElementById('mensagemSucesso').textContent = 'Usuário atualizado com sucesso!';
                document.getElementById('mensagemSucesso').classList.remove('d-none');
            } else {
                const erro = await response.json();
                throw new Error(erro.message || 'Erro ao atualizar o usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById('mensagemErro').textContent = 'Erro ao atualizar o usuário. Verifique os campos e tente novamente.';
            document.getElementById('mensagemErro').classList.remove('d-none');
        }
    });

    // Botão de cancelar
    document.getElementById('cancelarBtn').addEventListener('click', function () {
        window.location.href = 'listar.html';
    });

    // Carregar dados do usuário ao carregar a página
    carregarDadosUsuario();
});
