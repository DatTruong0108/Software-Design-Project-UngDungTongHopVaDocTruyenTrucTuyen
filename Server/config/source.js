class Singleton {
    constructor() {     
        if (!Singleton.instance) {       
            Singleton.instance = this;
            Singleton.instanceCount = 0;
        }
        else{
            Singleton.instanceCount++;
        }
           
        return Singleton.instance;
    }

    getInstance() {      
        new Singleton();

        return Singleton.instance;
    }

     getInstanceCount() {
        return Singleton.instanceCount;
    }
}

module.exports = new Singleton;