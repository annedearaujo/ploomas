import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button, Input, Card, notification, Form } from 'antd';
import '../styles/styles.css';
import { useNavigate } from 'react-router-dom';


const AuthenticationPage: React.FC = () => {
    // Estado para armazenar a user-key
    const [userKey, setUserKey] = useState<string>('');
    const navigate = useNavigate();

    // Função para verificar a autenticação ao carregar a página
    useEffect(() => {
        const storedUserKey = Cookies.get('user-key');

        if (storedUserKey && storedUserKey.trim() !== '') {
            authenticateUser(storedUserKey);
        }
    }, []);

    const authenticateUser = async (key: string) => {
        try {
            // Enviar a requisição para autenticar a chave do usuário
            const response = await fetch('https://public-api2.ploomes.com/Self/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Key': key,
                },
            });

            if (response.ok) {
                // Autenticação bem-sucedida
                // Salvar a chave nos cookies
                Cookies.set('user-key', key, { expires: 1 }); // Cookie válido por 1 dia

                notification.success({
                    message: 'Autenticação bem-sucedida!',
                });
                // Redirecionar para a página inicial
                navigate('/');
            } else {
                // Autenticação falhou
                notification.error({
                    message: 'Erro na autenticação. Tente novamente.',
                });
            }
        } catch (error) {
            console.error('Erro na autenticação:', error);
        }
    };

    const handleAuthentication = () => {
        if (!userKey.trim()) {
            notification.error({
                message: 'A chave do usuário não pode estar vazia. Insira uma chave válida.',
            });
            return;
        }

        authenticateUser(userKey);
    };

    // Manipulador de evento para alterações na user-key
    const handleUserKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserKey(event.target.value);
    };

    // Renderize a tela de autenticação normalmente
    return (
        <div className="container"  >
            <Card title="Autenticação">
                    <p>Sua autenticação ainda não foi realizada ou expirou!
                        Por favor, insira sua user key para continuar.</p>
                    <Form onFinish={handleAuthentication}>
                        <Form.Item
                            label="Chave de usuário"
                            name="userKey"
                            rules={[
                                { required: true, message: 'A chave do usuário é obrigatória.' },
                            ]}
                        >
                            <Input value={userKey} onChange={handleUserKeyChange} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Salvar</Button>
                    </Form>
            </Card>
        </div>
    );
};

export default AuthenticationPage;