const { Sequelize } = require('sequelize');
const config = require('../src/config/database/config');
const models = require('../src/models');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(config.development);

async function generateUsersDb() {
  try {
    // Fetch all users with their relationships
    const users = await models.User.findAll({
      include: [
        {
          model: models.Client,
          as: 'client',
          attributes: ['id', 'name', 'status']
        },
        {
          model: models.Driver,
          as: 'driver',
          attributes: ['id', 'name', 'cnh', 'cnh_expiration', 'phone', 'status']
        }
      ],
      attributes: ['id', 'name', 'email', 'role', 'status', 'createdAt', 'updatedAt']
    });

    // Transform the data into a more readable format
    const usersData = users.map(user => {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      };

      // Add client info if exists
      if (user.client) {
        userData.client = {
          id: user.client.id,
          name: user.client.name,
          status: user.client.status
        };
      }

      // Add driver info if exists
      if (user.driver) {
        userData.driver = {
          id: user.driver.id,
          name: user.driver.name,
          cnh: user.driver.cnh,
          cnh_expiration: user.driver.cnh_expiration,
          phone: user.driver.phone,
          status: user.driver.status
        };
      }

      return userData;
    });

    // Create the output directory if it doesn't exist
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the data to a JSON file
    const outputPath = path.join(outputDir, 'users_db.json');
    fs.writeFileSync(outputPath, JSON.stringify(usersData, null, 2));

    console.log(`Users database has been written to ${outputPath}`);
    console.log(`Total users: ${usersData.length}`);

    // Print summary by role
    const roleCount = usersData.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    console.log('\nUsers by role:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`${role}: ${count}`);
    });

  } catch (error) {
    console.error('Error generating users database:', error);
  } finally {
    await sequelize.close();
  }
}

generateUsersDb(); 