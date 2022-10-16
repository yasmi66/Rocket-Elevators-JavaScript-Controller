
let elevatorID = 1
let floorRequestButtonID = 1
let callButtonID = 1

class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
       this.ID = _id;
       this.status = "";
       this.elevatorList = [];
       this.callButtonList = [];


       this.createElevators(_amountOfFloors, _amountOfElevators);
       this.createCallButtons(_amountOfFloors);

    };

    
    
    createCallButtons(_amountOfFloors) {
        let buttonFloor = 1;
    
        for (let i = 1; i < _amountOfFloors; i++){
            
            if (buttonFloor < _amountOfFloors) {
                let callButton = new CallButton(callButtonID, "OFF", buttonFloor, "up");
                this.callButtonList.push(callButton);
                callButtonID++;
            }

            if (buttonFloor > 1) {
                let callButton = new CallButton(callButtonID, "OFF", buttonFloor, "down");
                this.callButtonList.push(callButton);
                callButtonID++;
            }
        buttonFloor++;
        }
    }

    createElevators(_amountOfFloors, _amountOfElevators) {
        let elevatorID = 1
        for (let i = 1; i < _amountOfElevators; i++) {
            let elevator = new Elevator(elevatorID, "idle", _amountOfFloors, 1);
            this.elevatorList.push(elevator);
            elevatorID++;
        }
    }

    requestElevator (floor, direction) {
        let chosenElevator = this.findElevator(floor, direction);
        chosenElevator.floorRequestList.push(floor);
        chosenElevator.move();
        chosenElevator.operateDoors()
        // chosenElevator.door.status = "opened";
        return chosenElevator;
    }

    

    findElevator (requestedFloor, requestedDirection) {

        let bestElevator;
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformation;
        

        for (let i = 0; i < this.elevatorList.length; i++) {
            let elevator = this.elevatorList[i];
            if (requestedFloor == elevator.currentFloor && elevator.status == "stopped" && requestedDirection == elevator.direction){
                bestElevatorInformation = this.checkIfElevatorIsBetter(1, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
    
            }else if ( requestedFloor > elevator.currentFloor && elevator.direction == "up" && requestedDirection == elevator.direction){
                bestElevatorInformation = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
    
            }else if ( requestedFloor < elevator.currentFloor && elevator.direction == "down" && requestedDirection == elevator.direction){
                bestElevatorInformation = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
    
            }else if (elevator.status == "idle"){
                bestElevatorInformation = this.checkIfElevatorIsBetter(3, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
    
            }else {
                bestElevatorInformation = this.checkIfElevatorIsBetter(4, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
            }
    
            bestElevator = bestElevatorInformation.bestElevator;
            bestScore = bestElevatorInformation.bestScore;
            referenceGap = bestElevatorInformation.referenceGap;
        };
    
        return bestElevator
    
    }

    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor) {
        if (scoreToCheck < bestScore) {
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs(newElevator.currentFloor - floor);
        } else if (bestScore == scoreToCheck) {
            let gap = Math.abs(newElevator.currentFloor - floor);
            if (referenceGap > gap) {
                bestElevator = newElevator;
                referenceGap = gap;
            }
        }

        let bestElevatorInformation ={
            bestElevator,
            bestScore,
            referenceGap
        }
    
        return bestElevatorInformation;
    }
}



class Elevator {
    constructor(_id, _amountOfFloors) {
        this.ID = _id; 
        this.status = "idle";
        this.currentFloor = 1;
        this.direction = null;
        this.overweight = false;
        this.obstruction = false;
        this.door = new Door(_id);
        this.floorRequestButtonsList = [];
        this.floorRequestList = [];

        this.createFloorRequestButtons(_amountOfFloors);
    }

    createFloorRequestButtons(_amountOfFloors) {
        let buttonFloor = 1;
        // let floorRequestButtonID = 1;
        for (let i = 1; i < _amountOfFloors; i++) {
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, "OFF", buttonFloor);
            this.floorRequestButtonsList.push(floorRequestButton);
            buttonFloor++;
            floorRequestButtonID++;
        }
    }

    requestFloor(floor) {
        this.floorRequestList.push(floor);
        this.sortFloorList;
        this.move();
        this.operateDoors();
    }

    move() {
        while (this.floorRequestList.length != 0){
            let destination = this.floorRequestList[0];
            this.status = "moving";
            if (this.currentFloor < destination){
                this.direction ="up";
                this.sortFloorList();
                while (this.currentFloor < destination){
                    this.curentFloor++;
                    this.screenDisplay = this.currentFloor;
                }
            }else if (this.currentFloor > destination){
                this.direction = "down";
                this.sortFloorList();
                while (this.currentFloor > destination){
                    this.currentFloor--;
                    this.screenDisplay = this.currentFloor;
                }
            }
            this.status = "stopped";
            this.floorRequestList.shift();
        }  
        this.status = "idle"
    }

    sortFloorList(){
        if (this.direction == "up"){
            this.floorRequestList.sort((a,b) => a-b);
        }else{
            this.floorRequestList.sort((b,a) => b-a);
        }
    }

    operateDoors() {
        if (this.door.status == "opened"){
            this.door.status = "closed";
        }else if (this.door.status == "closed")
            this.door.status = "opened";
    }
   
    


}


class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = "idle";
        this.floor = _floor
        this.direction = _direction
    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = "idle";
        this.floor = _floor;
    }
}

class Door {
    constructor(_id) {
        this.ID = _id;
        this.status = "idle";
    }
}

module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }