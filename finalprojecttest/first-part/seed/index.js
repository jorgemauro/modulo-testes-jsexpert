const {faker,}=require('@faker-js/faker')
const Car=require('./../src/entities/car')
const CarCategory=require('./../src/entities/carCategory')
const Custumer =require('../src/entities/custumer')
const {join }=require('path')
const {writeFile} = require('fs/promises')
const seederBaseFolder=join(__dirname,"../","database")
const ITEMS_AMOUNT=2

const carCategory=new CarCategory({
    id:faker.datatype.uuid(),
    name: faker.vehicle.type(),
    carIds:[],
    price: faker.finance.amount(20,100)
})
const cars=[]
const custumers=[]
for(let index=0;index<=ITEMS_AMOUNT;index++){
    const car=new Car({
    id:faker.datatype.uuid(),
    name: faker.vehicle.model(),
    avaliable:true,
    gasAvaliable:true,
    releaseYear:faker.date.past().getFullYear()
    })
    carCategory.carIds.push(car.id)
    cars.push(car)
    const custumer=new Custumer({
    id:faker.datatype.uuid(),
    name: faker.name.firstName(),
    age: faker.datatype.number({min:18,max:50})
    })
    custumers.push(custumer)
}
const write= (filename,data)=>writeFile(join(seederBaseFolder,filename),JSON.stringify(data))
;(async()=>{
    await write('cars.json',cars)
    await write('custumers.json',custumers)
    await write('carCategories.json',[carCategory])
})()