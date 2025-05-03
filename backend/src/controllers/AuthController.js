const { User } = require('../models');
const { generateToken } = require('../config/auth/jwt');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      if (user.status !== 'active') {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      // Atualiza último login
      await user.update({ last_login: new Date() });

      const token = generateToken(user);

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async logout(req, res) {
    try {
      // Em uma implementação mais robusta, poderíamos invalidar o token
      // ou adicionar à uma blacklist
      return res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new AuthController(); 