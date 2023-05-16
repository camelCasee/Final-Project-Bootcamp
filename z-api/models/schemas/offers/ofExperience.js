const { Schema } = require('mongoose')

module.exports = new Schema({
    position: {
        type: String,
    },
    // industry: {
    //     type: String,
    //     enum: ['Agriculture; plantations;other rural sectors', 'Basic metal production', 'Chemical industries', 'Commerce',
    //             'Construction', 'Education', 'Financial services; professional services', 'Food; drink; tobacco', 'Forestry; wood; pulp and paper', 
    //             'Health Services', 'Hotels; tourism; catering', 'Mining', 'Mechanical and electrical engineering', 'Media; culture; graphical', 
    //             'Oil and gas production; oil refining', 'Postal and telecommunications services', 'Public service', 
    //             'Shipping; ports; fisheries; inland waterways', 'Textiles; clothing; leather; footwear', 
    //             'Transport (including civil aviation; railways; road transport)', 'Transport equipment manufacturing', 
    //             'Utilities (water; gas; electricity)', 'Other industries']
    // },
    years: {
        type: String
    }
})