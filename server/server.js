const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');

const port = process.env.PORT | 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const swaggerOptions = {
	swaggerDefinition: {
		
	        info: {
		 title: 'Class API',
                 version: '1.0.0',
		 description: 'Class API',
        },
	severs: [
		{
        	url: 'http://157.245.92.132:3000',
            },
		],
	},
	apis: ['./server.js'],
};

const specs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 5
});

app.get('/', (req, res) => {
  res.send('My droplet page');
});


/**
 * @swagger
 * /agents:
 *    get:
 *      description: Return all agents
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: My agent code
 */

app.get('/agents', async (req, res) => {
        let conn;
        try {
                conn = pool.getConnection();
                const results = await pool.query('Select Agent_code from agents');
                res.setHeader('Content-Type', 'text/plain');
                res.json(results);
        } catch (err) {
                throw err;
		res.status(500).send('Internal Server Error');
        }
});

/**
 * @swagger
 * /company:
 *    get:
 *      description: This should show  the Company Id and Company Name for company table
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The company
 */

app.get('/company', async (req, res) => {
        let conn;
        try {
                conn = pool.getConnection();
                const results = await pool.query('Select Company_Id, Company_name from company');
                res.setHeader('Content-Type', 'text/plain');
                res.json(results);
        } catch (err) {
                throw err;
		res.status(500).send('Internal Server Error');
        }
});

/**
* @swagger
* /customers:
*    get:
*      description: This should show  the Cust Code and Cust City for customer table
*      produces:
*      - application/json
*      responses:
*         200:
*         description: The customers
*/

app.get('/customers', async (req, res) => {
        let conn;
        try {
                conn = pool.getConnection();
                const results = await pool.query('Select Cust_Code, Cust_City from customer');
                res.setHeader('Content-Type', 'text/plain');
                res.json(results);
        } catch (err) {
                throw err;
		res.status(500).send('Internal Server Error');
        }
});

/**
 * @swagger
 * /day:
 *    get:
 *      description: This should show  the order num and order amount for days ordered table
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The days ordered
 */

app.get('/day', async (req, res) => {
        let conn;
        try {
                conn = pool.getConnection();
                const results = await pool.query('Select Ord_Num, Ord_Amount from daysorder');
                res.setHeader('Content-Type', 'text/plain');
                res.json(results);
        } catch (err) {
                throw err;
		res.status(500).send('Internal Server Error');
        }
});

/**
 * * @swagger
 * * /say:
 * *    get:
 * *      description: Testing the functions from AWS
 * *      produces:
 * *      - application/json
 * *      responses:
 * *         200:
 * *         description: The say
 * */


app.get('/say', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const results = await axios.get('https://yr5r7z34xptxkhlko3e66ia76m0etwkj.lambda-url.us-east-1.on.aws/?keyword=' + keyword);
    res.json(results.data);
  } catch (err) {
    	throw err;
   	 res.status(500).send('Internal Server Error');
  }
});


/**
 * @swagger
 * /customer:
 *    post:
 *      description: This will insert customer name Mike to customer table
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The customer
 */

app.post('/customer', async (req, res) => {
	let conn;
	try {
		conn  = await pool.getConnection();
		const data = await conn.query("Insert Into customer (Cust_Name) Values ('Mike')");
		console.log(data);
		const jsonS = JSON.stringify(data)
		res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(jsonS);
        }
        catch(e) {
        }
});

/**
 * @swagger
 * /day:
 *    post:
 *      description: This will select ord num from days order table where the order amount is greater than 100
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The day
 */

app.post('/day', async  (req, res) => {
	let conn;
	try {
		conn = await pool.getConnection();
		const data = await conn.query("Select Ord_Num from daysorder Where Ord_Amount > '1000'");
		console.log(data);
		const jsonS = JSON.stringify(data)
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(jsonS);
	}
	catch(e) {
	}
});

/**
 * @swagger
 * /customer/patch:
 *    patch:
 *      description: This will update customer table and set the name to Mike where payment amount is 0
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The customers/patch
 */

app.patch('/customers/patch', async (req, res) => {
	let conn;
	try {
		conn = await pool.getConnection();
		const data = await conn.query("Update customer Set Cust_Name = 'Mike' Where Payment_Amt = '0'");
		console.log(data);
		const jsonS = JSON.stringify(data)
		res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(jsonS);
        }
        catch(e) {
        }
});

/**
 * @swagger
 * /days/put:
 *    put:
 *      description: This will Update days order table and set order number to 5 where amount greater than 0
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The days/put
 */

app.put('/days/put', async (req, res) => {
	let conn;
        try {
                conn = await pool.getConnection();
                const data = await conn.query("Update daysorder Set Ord_Num = '5' Where Ord_Amount > '0'");
                console.log(data);
                const jsonS = JSON.stringify(data)
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(jsonS);
        }
        catch(e) {
        }
});

/**
 * @swagger
 * /customer/delete:
 *    delete:
 *      description: This delete customer where the payment amount is greater than 3800
 *      produces:
 *      - application/json
 *      responses:
 *         200:
 *         description: The customers/delete
 */

app.delete('/customers/delete', async (req, res) => {
        let conn;
        try {
                conn = await pool.getConnection();
                const data = await conn.query("Delete From customer Where Payment_Amt > '3800'");
                console.log(data);
                const jsonS = JSON.stringify(data)
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(jsonS);
        }
        catch(e) {
        }
});


app.listen(port, () => {
        console.log('App listening at http://157.245.92.132:${port}..')
})
