const {Divinity} = require('./divinity');
const {Population} = require('./population');

class City {
    constructor(name, divinityName) {
        this.name_ = name || 'UNKCITY';
        this.divinity_ = new Divinity(divinityName);
        this.population_ = new Population(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
        this.corn_ = 1000;
        this.gold_ = 1000;
        this.init();
    }

    init() {
        this.divinity.init();
        this.divinity.worldEvents.on('favor', shit => this.getShit(shit));
        this.divinity.worldEvents.on('blessing', shit => this.getShit(shit));
    }

    getShit(s) {
        this.corn_ += Math.floor(s.corn);
        this.gold_ += Math.floor(s.gold);
    }

    giveShit() {
        this.divinity.offeringCorn(this.corn_);
        this.divinity.offeringGold(this.gold_);
        this.corn_ = 0;
        this.gold_ = 0;
    }

    fight(C2) {
        let max = (this.population_.nbGuerrier_ > C2.population_.nbGuerrier_) ? C2.population_.nbGuerrier_ :
            this.population_.nbGuerrier_;
        let i;
        let winThis = 0, winOther = 0;
        if (Math.random() <= 0.4999)
        {
            for (i = 0; i < max; i++) {
                this.population_.guerriers_[i].Attack(C2.population_.guerriers_[i]);
                if (!this.population_.guerriers_[i].estVivant()) {
                    console.log("Che ton soldat est mort comme une merde");
                    this.population_.nbGuerrier_ -= 1;
                    this.population_.guerriers_.splice(i);
                    max = (this.population_.nbGuerrier_ > C2.population_.nbGuerrier_) ? C2.population_.nbGuerrier_ :
                        this.population_.nbGuerrier_;
                    console.log(max);
                    winOther ++;
                }
                if (!C2.population_.guerriers_[i].estVivant()) {
                    console.log("Votre guerrier a ete sauve par " + C2.divinity_.name_);
                    C2.population_.guerriers_[i].pv = 1;
                    winThis ++;
                }
            }
        }
        else
        {
            for (i = 0; i < max; i++)
            {
                console.log(i);
                C2.population_.guerriers_[i].Attack(this.population_.guerriers_[i]);
                if (!C2.population_.guerriers_[i].estVivant()) {
                    console.log("Che ton soldat est mort comme une merde");
                    C2.population_.nbGuerrier_ -= 1;
                    C2.population_.guerriers_.splice(i);
                    max = (this.population_.nbGuerrier_ > C2.population_.nbGuerrier_) ? C2.population_.nbGuerrier_ :
                        this.population_.nbGuerrier_;
                    console.log(max);
                    winThis ++;
                }
                if(!this.population_.guerriers_[i].estVivant()) {
                    console.log("Votre guerrier a ete sauve par " + this.divinity_.name_);
                    this.population_.guerriers_[i].pv = 1;
                    winOther ++;
                }
            }
        }
        if (winThis > winOther) {
            console.log("City: " + this.name_ + " is the winner WoooohWoooh ! DaTaGueule " + C2.name + " !");
            this.gold_ += C2.gold / 2;
            this.corn_ += C2.corn / 2;
            C2.gold /= 2;
            C2.corn /= 2;
        }
        else if (winThis === winOther) {
            console.log("MAAAAAAAAAAAAAAAAAAAATCH NUL ! DMG IL VA RIEN SE PASSER !");
        }
        else {
            console.log("City: " + C2.name + " is the winner WoooohWoooh ! DaTaGueule " + this.name_ + " !");
            C2.gold += this.gold_ / 2;
            C2.corn += this.corn_ / 2;
            this.gold_ /= 2;
            this.corn_ /= 2;
        }

    }

    isAlive() {
        if(this.corn_ === 0 || this.gold_ === 0|| this.population_.nbMarchand === 0 || this.population_.nbGuerrier === 0) {
            return true;
        }
        else {
            return true;
        }
    }

    trade(C2) {
        let max = (this.population_.nbMarchand_ > C2.population_.nbMarchand_) ? C2.population_.nbMarchand_ :
            this.population_.nbMarchand_;
        let i;
        if (Math.random() <= 0.4999) {
            for (i = 0; i < max; i++) {
                if (Math.random()<0.08) {
                    console.log("Votre marchand marchand a ete attaque par de vilains, super pas gentils brigands"
                        + "(Pas d echange il est die mamene)!");
                    this.population_.nbMarchand_ -= 1;
                    this.population_.marchands_[i].splice(i);
                    max = (this.population_.nbMarchand_ > C2.population_.nbMarchand_) ? C2.population_.nbMarchand_ :
                        this.population_.nbMarchand_;
                }
                else {
                    this.population_.marchands_[i].Echange_gold_for_corn(C2.population_.marchands_[i]);
                    this.gold_ = this.population_.marchands_[i].actual_gold_ / 2;
                    this.corn_ = this.population_.marchands_[i].actual_corn_ / 2;
                }
            }
        }
        else {
            for (i = 0; i < max; i++) {
                if (Math.random()<0.08) {
                    console.log("Votre marchand marchand a ete attaque par de vilains, super pas gentils brigands"
                        + "(Pas d echange il est die mamene)!");
                    C2.population_.nbMarchand_ -= 1;
                    this.population_.marchands_[i].splice(i);
                    max = (this.population_.nbMarchand_ > C2.population_.nbMarchand_) ? C2.population_.nbMarchand_ :
                        this.population_.nbMarchand_;
                }
                else {
                    this.population_.marchands_[i].Echange_corn_for_gold(C2.population_.marchands_[i]);
                    this.gold_ = this.population_.marchands_[i].actual_gold / 2;
                    this.corn_ = this.population_.marchands_[i].actual_corn / 2;
                }
            }
        }
    }

    cout_troupes() {
        let i, rez = 0;
        for (i = 0; i < this.population_.nbGuerrier_; i++) {
            rez += this.population_.guerriers_[i].prix_;
        }
        for (i = 0; i < this.population_.nbMarchand_; i++) {
            rez += this.population_.marchands_[i].prix_;
        }
        this.corn_ = (this.corn_ - rez*2 > 0) ? (this.corn_ - rez*2) : 0;
        this.gold_ = (this.gold_ - rez > 0) ? (this.corn_ - rez) : 0;
        if (this.corn_ == 0 || this.gold_ == 0) {
            delete this.population_;
        }

    }



    showShit() {
        console.log(`City: ${this.name_}, Corn ${this.corn_}, Gold: ${this.gold_}, Divinity: ${this.divinity.name}`);
        this.population_.showPop();
    }

    get name(){
        return this.name_;
    }
    get divinity(){
        return this.divinity_;
    }
    get population(){
        return this.population_;
    }
    get corn() {
        return this.gold_;
    }

    get gold() {
        return this.corn_;
    }

    set corn(corn){
        this.corn_ = corn;
    }

    set gold(gold){
        this.corn_ = gold;
    }
}

module.exports = {City};