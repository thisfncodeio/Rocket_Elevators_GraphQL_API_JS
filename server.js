var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Making a connection to both databases
var query = require('./mysqlconnection.js');
var { pgquery, pgconnection } = require('./postgresconnection.js');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type Query {
        intervention(id: Int!): Intervention
        building(id: Int!): Building
        customer(id: Int!): Customer
        employee(id: Int!): Employee
        buildingDetail(id: Int!): BuildingDetail        
    }
    type Intervention {
        id: Int!
        buildingid: Int
        starttime: String
        finishtime: String
        address: Address
        
    }
    type Building {
        id: Int!
        building_name: String
        address_id: Int!
        customer_id: Int!
        administrator_full_name: String
        administrator_phone: String
        administrator_email: String
        starttime: Intervention
        finishtime: Intervention        
        address: Address
        customer: Customer
        interventions: [Intervention]
        buildingDetail: [BuildingDetail]
    }
    type Address {
        street_address: String
        city: String
        state: String
        country: String
    }
    type Customer {
        id: Int!
        business_name: String
        contact_full_name: String
        contact_phone: String
        contact_email: String
    }
    type Employee {
        id: Int!
        first_name: String
        last_name: String
        email: String
        title: String
        interventions: [Intervention]
        building: [Building]
        buildingDetail: [BuildingDetail]
    }
    
    type BuildingDetail {
        id: Int!
        building_id: Int!
        information_key: String
        value: String
    }
`);


// The root provides a resolver function for each API endpoint
var root = {
  intervention: async ({ id }) => {
    const res1 = await pgquery('SELECT * FROM factintervention where id = ' + id + ';');
    const rest2 = await query('SELECT * FROM addresses JOIN buildings ON buildings.address_id = addresses.id WHERE buildings.id = ' + res1['rows'][0].buildingid);

    const intervention = res1.rows[0];

    intervention['address'] = rest2[0]
    return intervention;

  },
  building: async ({ id }) => {
    const res1 = await pgquery('SELECT * FROM factintervention where buildingid = ' + id);
    const res2 = await query('SELECT buildings.id, buildings.building_name, customers.contact_full_name, customers.business_name, customers.contact_phone, customers.contact_email FROM buildings INNER JOIN customers ON buildings.customer_id = customers.id WHERE buildings.id = ' + id)
    const res3 = await query('SELECT * FROM buildings where id =' + id);
    //Extract informations from response object
    const interventions = res1.rows;
    const customer = res2[0];
    const building = res3[0];


    // //Add address values to Address type of Intervention
    building['customer'] = customer;
    building['interventions'] = interventions;
    return building;
  },
  employee: async ({ id }) => {
    const res1 = await query('SELECT * FROM employees WHERE id = ' + id)
    const res2 = await pgquery('SELECT * FROM factintervention WHERE employeeid = ' + id)


    var buildingIDList = []

    //Get list of buildings ID
    res2.rows.forEach(function (building) {
      buildingIDList.push(building.buildingid)
    })


    //Filters buildingIDList to get unique value
    var filteredBuildingList = buildingIDList.filter((value, index, self) => self.indexOf(value) === index);


    //Change building list into string for SQL
    StringedBuildings = filteredBuildingList.join();

    //Get required buildings infos
    buildings = await query('SELECT * FROM buildings WHERE id IN (' + StringedBuildings + ')')

    //Get building details
    buildingDetails = await query('SELECT * FROM building_details WHERE building_id IN (' + StringedBuildings + ')')


    //Extract informations from response object
    const employee = res1[0];

    employee['interventions'] = res2.rows;
    employee['building'] = buildings;
    employee['buildingDetail'] = buildingDetails;

    return employee;
  }
};


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

pgconnection();
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');