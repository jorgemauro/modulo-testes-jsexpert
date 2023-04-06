const BaseRepository = require("../repository/base/baseRepository");
const Tax=require('../entities/tax')
const Transaction=require('../entities/trasaction')
class carService{
    constructor({cars}){
        this.carRepository=new BaseRepository({file:cars})
        this.taxesBasedOnAge=Tax.taxesBasedOnAge
        this.currencyFormat=new Intl.NumberFormat('pt-br',{
            style:'currency',
            currency:'BRL'
        })
    }
    async getAvaliableCar(category){
        const carId=this.chooseRandomCar(category)
        const car=await this.carRepository.find(carId)
            return car
    }
    getRandomPositionFromArray(list){
        const listLength=list.length
        return Math.floor(Math.random()*listLength)
    }
    chooseRandomCar(carCategory){
        const randomCarIndex=this.getRandomPositionFromArray(carCategory.carIds)
        const carId=carCategory.carIds[randomCarIndex]
        return carId
    }
    CalculateFinalPrice(
            customer,
            carCategory,
            numberOfDays
        ){
            const {age}=customer
            const {price}=carCategory
            const {then:tax}=this.taxesBasedOnAge.find(tax=>age>=tax.from&&age<=tax.to)

            const finalPrice=((tax*price)*numberOfDays)
            const formattedPrice=this.currencyFormat.format(finalPrice)
            return formattedPrice
        }
        async rent(
            customer,carCategory,numberOfDays
        ){
            const  car= await this.getAvaliableCar(carCategory)
            const finalPrice=await this.CalculateFinalPrice(customer,carCategory,numberOfDays)

            const today=new Date()
            today.setDate(today.getDate()+numberOfDays)
            const options={year:'numeric', month:'long', day:'numeric'}
            const dueDate=today.toLocaleDateString("pt-br",options)
            const transaction=new Transaction({customer,dueDate,car,amount:finalPrice})
            return transaction
        }
}
module.exports=carService