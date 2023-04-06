const {describe,it,before,beforeEach,afterEach} = require('mocha')
const CarService = require('./../../src/service/carService')
const {join}=require('path')
const {expect}=require('chai')
const sinon=require('sinon')
const carDatabase=join(__dirname,'./../../database',"cars.json")
const Transaction = require('../../src/entities/trasaction')
const mocks={
    validCarCategory:require('./../mocks/valid-carCategory.json'),
    validCar:require('./../mocks/valid-car.json'),
    validCustomer:require('./../mocks/valid-custumer.json')
}
describe('carService Suite Tests', () => { 
    let carService={}
    let sandbox={}
    before(()=>{
        carService=new CarService({
            cars:carDatabase
        })
    })
    beforeEach(()=>{
        sandbox=sinon.createSandbox()
    })
    afterEach(()=>{
        sandbox.restore()
    })
    it('Should retrieve random postion from an array',()=>{
        const data=[0,1,2,3,4]
        const result = carService.getRandomPositionFromArray(data)
        expect(result).to.be.lte(data.length).and.be.gte(0)
    })
    it('should choose the first id from carIds in carCategory',()=>{
        const carCategory=mocks.validCarCategory
        const carIndex=0
        sandbox.stub(carService,carService.getRandomPositionFromArray.name).returns(carIndex)
        const result = carService.chooseRandomCar(carCategory)
        const expected=carCategory.carIds[carIndex]
        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })
    it('given a carCategory it sould return an avaliable car',async()=>{
        const car=mocks.validCar
        const carCategory=Object.create(mocks.validCarCategory)
        
        sandbox.stub(carService.carRepository,carService.carRepository.find.name).resolves(car)
        sandbox.spy(carService,carService.chooseRandomCar.name)
        carCategory.carIds=[car.id]
        const result = await carService.getAvaliableCar(carCategory)
        const expected=car
        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })
    it('given a carCategory, customer and number of days it calculates final amount in real', async()=>{
        const customer=Object.create(mocks.validCustomer)
        customer.age=50
        const carCategory=Object.create(mocks.validCarCategory)
        carCategory.price=37.6
        const numberOfDays=5
        sandbox.stub(carService,"taxesBasedOnAge").get(()=>[{from:31,to:100,then:1.3}])

        const expected=carService.currencyFormat.format(244.40)
        const result=carService.CalculateFinalPrice(
            customer,
            carCategory,
            numberOfDays
        )
        expect(result).to.be.deep.equal(expected)
    })
    it('given a customer and a car category it should return trasaction receipt', async()=>{
        const car=mocks.validCar
        const carCategory={...mocks.validCarCategory,
        price:37.6,
        carIds:[car.id]
        }
        const customer=Object.create(mocks.validCustomer)
        customer.age=20
        const dueDate="10 de novembro de 2020"
        const now=new Date(2020,10,5)
        const numberOfDays=5
        sandbox.useFakeTimers(now.getTime())
        sandbox.stub(carService.carRepository,carService.carRepository.find.name).resolves(car)
        const expectedAmount = carService.currencyFormat.format(206.80)
        const result=await carService.rent(
            customer,carCategory,numberOfDays
        )
        const expected=new Transaction({
            customer,
            car,
            amount:expectedAmount,
            dueDate
        })
        expect(result).to.be.deep.equal(expected)
        
    })
 })