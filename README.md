# Rocket_Elevators_GraphQL_API_JS

**CodeBoxx Week 8**

This week we used GraphQL to retrieve data from two data different data sources using just one API request. These data sources include MySQL and Postgresql. MySQL behave as our main app's operational database, whereas, Postgresql behaves as our data warehouse or decision database.

The GraphQL Solution was to be able to respond to 3 main queries:

---

**Query #1**
* **Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.**
    
      {
        interventions(building_id: 1) {
          employee_id
          start_intervention
          end_intervention
          building_details {
            building_id
            infoValue
            infoKey
          }
          address {
            city
          }
        }
      }

---
  
**Query #2**
* **Retrieving customer information and the list of interventions that took place for a specific building.**
      
      { 
        buildings(id: 1) { 
          customer { 
            entrepriseName 
            authorityName
          } 
          interventions {
            building_id
          } 
        } 
      }
      
---
      
**Query #3**
* **Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails)      associated with these buildings.**
      
      { 
        employees(id: 1) { 
          firstName 
          lastName 
          interventions {
            building_id building_details {  
              infoKey 
              infoValue 
            }  
          }
        } 
      }
