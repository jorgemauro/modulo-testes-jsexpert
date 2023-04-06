
const http = require("http");
const { once } = require("events");
const carCategory = require("../../database/carCategories.json");
const route = {
  "car_categories":(request, response) => {
    if(request?.params?.id){
        const idselect=request.params.id
        selectCategory=carCategory.find(category=>category.id==idselect)
        if(selectCategory){
        response.write(JSON.stringify(selectCategory));
        return response.end();
        }else{        
            response.writeHead(404);
            return response.end("not found!");
        }

    }
    response.write(JSON.stringify(carCategory));
    return response.end();
  },
  default(request, response) {
    response.writeHead(404);
    return response.end("not found!");
  }
};
function handler(request, response) {
  const { url, method } = request;
  let  routeKey = url.split('?');
  if(routeKey.length>1){
  const paramsInd=routeKey[1].split('&')
  const params={}
  paramsInd.forEach(param=>{
    const divpr=param.split('=')
    params[divpr[0]]=divpr[1]
  request.params=params
  })
  }
  routeKey = routeKey[0].split('/');
  const chosen = route[routeKey[1]] || route.default;
  return chosen(request, response);
}

const app = http
  .createServer(handler)
  .listen(3000, () => console.log("runnig at 3000"));

module.exports = app;
