const BaseRepository = require("../repository/base/baseRepository");

class carService{
    constructor({cars}){
        this.carRepository=new BaseRepository({file:cars})
    }
    async getAvaliableCar(category){
        const carId=this.chooseRandomCar(category)
        console.log(carId)
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
}
module.exports=carService