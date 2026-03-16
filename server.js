require("dotenv").config()

const express = require("express")
const cors = require("cors")
const fs = require("fs")
const csv = require("csv-parser")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

let salesData = []

fs.createReadStream("./data/sales.csv")
.pipe(csv())
.on("data",(row)=> salesData.push(row))
.on("end",()=>{
console.log("CSV Loaded")
})

app.post("/ask",(req,res)=>{

try{

const { question } = req.body

if(!question){
return res.json({
answer:"Please ask a question.",
data:salesData
})
}

const q = question.toLowerCase()

let revenueByProduct = {}
let revenueByRegion = {}
let totalRevenue = 0

salesData.forEach(row=>{

const product = row.product
const region = row.region
const revenue = Number(row.revenue)

totalRevenue += revenue

revenueByProduct[product] =
(revenueByProduct[product] || 0) + revenue

revenueByRegion[region] =
(revenueByRegion[region] || 0) + revenue

})

let answer = "Here is an overview of the dataset."

if(q.includes("most") || q.includes("top") || q.includes("best")){

let bestProduct = Object.keys(revenueByProduct)
.reduce((a,b)=> revenueByProduct[a] > revenueByProduct[b] ? a : b)

answer = `${bestProduct} generated the highest revenue.`

}

else if(q.includes("total")){

answer = `Total revenue across all products is $${totalRevenue}.`

}

else if(q.includes("region")){

let bestRegion = Object.keys(revenueByRegion)
.reduce((a,b)=> revenueByRegion[a] > revenueByRegion[b] ? a : b)

answer = `${bestRegion} is the highest performing region.`

}

else if(q.includes("product")){

answer = "Showing revenue distribution by product."

}

res.json({
answer,
data:salesData
})

}catch(err){

console.error(err)

res.status(500).json({
error:"Server failed to analyze data"
})

}

})

app.listen(3000,()=>{
console.log("Server running on port 3000")
})