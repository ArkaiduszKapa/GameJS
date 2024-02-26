const maps = {
    "city1": {
        "content": `
            <div id="g_screen" >
            <img src="img/town-screen.jpeg" width="100%" height="100%">
        </div>
        <div style="top:26px; left:800px; position: absolute;" onclick="game.changeMap('dungeonL1')">
            <img src="img/door.jpg" >
        </div>
        <div style="top:877px; left:780px; position: absolute;">
            <img src="img/door.jpg">
        </div>
        <div style="top:440px; left:1292px; position: absolute;">
            <img src="img/door.jpg" style="height: 40px;">
        </div>
        `
    },
    "dungeonL1": {
        "content": `
        <div id="g_screen" >
                    <img src="img/dungeonlvl1.jpeg" width="100%" height="100%" id="C1M1L1">
                </div>
                <div style="top:650px; left:700px; position: absolute;" onclick="game.changeMap('attackMap1')" class="monster-image">
                    <img src="img/szczur2.png" data-monster-id="C1M1L1">
                </div>
                <div style="top:750px; left:435px; position: absolute;" onclick="game.changeMap('city1')">
                    <img src="img/door.jpg" style="width: 200%;">
                </div>`
    },
    'attackMap1': {
        "content": `
        <div id="g_screen" style="display: flex; flex-direction: row; position: relative;">
            <img src="img/attackBG.png" width="100%" height="100%" id="C1M1L1">
            <div style="padding: 10px; width: 93%; height: 20%; background-color: #15141a; border: 4px solid #4a4c5c; border-radius: 10px; position: absolute; bottom: 0; left: 0; margin: 1%; padding:2%; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">Left Content</div>
                <div style="width: 30%; border: 4px solid #4a4c5c; border-radius: 10px; padding: 2%;">
                    <button style="width: 100%; margin: 3% auto;" onclick="game.Experience.pve('C1M1L1')">Normal Attack</button>
                    <button style="width: 100%; margin: 3% auto;" onclick="game.special1()">Frost Slash</button>
                    <button style="width: 100%; margin: 3% auto;" onclick="game.specail2()">Break Through</button>
                    <button style="width: 100%; margin: 3% auto;" onclick="game.changeMap('dungeonL1')">end fight</button>
                </div>
            </div>
            <div style="top: 40%; left: 45%; position: absolute;" onclick="game.attackMonster('C1M1L1')" class="monster-image">
                <img src="img/szczur2.png" data-monster-id="C1M1L1">
            </div>
        `
    }
};

class Player {
    constructor(name, level, hp, maxHp, xp, maxXp, dmg, money) {
        this.name = name || "zbychu";
        this.level = level || 1;
        this.hp = hp || this.calculateMaxHp();
        this.maxHp = maxHp || this.calculateMaxHp();
        this.xp = xp || 2;
        this.maxXp = maxXp || this.calculateMaxXp();
        this.dmg = dmg || 2;
        this.money = money || 0;
        this.Name(this.name);
    }
    Name(name){
        const playerName = document.getElementById("p_name");
        const playerNameElement = document.createElement("p");
        playerNameElement.textContent = name;
        playerName.appendChild(playerNameElement);

    }
    updateStats() {
        document.getElementById("health_bar_fill").innerHTML = this.hp;
        document.getElementById("health_bar_fill").style.width = (this.hp / this.maxHp) * 100 + "%";
        
        var xpPercentage = (this.xp / this.maxXp) * 100;
    console.log("xpPercentage:", xpPercentage);
    console.log("this.xp:", this.xp);
console.log("this.maxXp:", this.maxXp);

    var xpBarFill = document.getElementById("xp_bar_fill");
    if (xpBarFill) {
        xpBarFill.style.width = xpPercentage + "%";
        
    }
        var lvl = document.getElementById("lvl");
        lvl.innerHTML = this.level;
        var money = document.getElementById("money");
        money.innerHTML = this.money;
    }

    damageChanger() {
        const damageMultiplier = 1.1;
        const levelDamage = this.dmg * Math.pow(damageMultiplier, this.level - 1);
        return Math.floor(levelDamage);
    }

    heal() {
        if (this.money >= 2) {
            this.money -= 2;
            this.hp += this.level + 10 * Math.pow(2.1, this.level);
            if (this.hp > this.maxHp) {
                this.hp = this.maxHp;
            }
            this.updateStats();
        } else {
            console.log('Not enough money to heal.');
        }
    }

    calculateMaxHp() {
        return 100 + 5 * this.level + 30 * Math.pow(1.1, this.level);
    }

    calculateMaxXp() {
        const calculatedMaxXp = Math.floor(100 * Math.pow(1.2, this.level) + 20 * this.level);
        console.log("Calculated Max XP:", calculatedMaxXp);
        return calculatedMaxXp;
    }

    levelUp() {
        this.level += 1;
        this.maxHp = this.calculateMaxHp();
        this.hp = this.maxHp;
        this.maxXp = this.calculateMaxXp();
        this.xp = 0;
        if (this.level == 21) {
            myGame.stop();
        }
        this.updateStats()
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.levelDown();
        }
    }

    levelDown() {
        this.level -= 1;
        this.maxHp = this.calculateMaxHp();
        this.hp = this.maxHp;
        this.maxXp = this.calculateMaxXp();
        this.xp = 0;
        
    }

}

class Monster {
    constructor(id, name, hp, max_hp, level,exp , damage, money, image, dropChance, drop) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.max_hp = max_hp;
        this.level = level;
        this.damage = damage;
        this.money = money;
        this.image = image;
        this.dropChance = dropChance || 0;
        this.drop = drop || "No Drop";
        this.exp = exp;
    }
}

class Experience {
    constructor(player, monsters) {
        this.player = player;
        this.monsters = monsters;
        console.log(this.monsters);
    }

    calculateXpGain(mob) {
        const baseXp = mob.exp || 0;
        const levelDifference = (mob.level || 0) - this.player.level;
        const adjustedXp = Math.max(0, baseXp + levelDifference);
        console.log("Base XP:", baseXp);
        console.log("Level Difference:", levelDifference);
        console.log("Adjusted XP:", adjustedXp);
        return adjustedXp;
    }

    findMob(mobID) {
        const mobs = this.monsters;
        return mobs.find((mob) => mob.id === mobID);
    }

    pve(mobID) {
        const attackedMob = this.findMob(mobID);
        if (attackedMob) {
            this.attack(attackedMob);
        } else {
            console.log(`${mobID} not found.`);
        }
    }

    attack(mob) {

        if (mob.exp !== undefined) {
            console.log("Before Attack - Player XP:", this.player.xp, "Max XP:", this.player.maxXp);
            mob.hp -= this.player.damageChanger();
            this.player.takeDamage(mob.damage);
            console.log(mob.hp);

            // Update player stats and UI during the fight
            this.updatePlayerUI();

            if (mob.hp <= 0) {
                this.player.xp += this.calculateXpGain(mob);
                this.player.money += mob.money;

                if (Math.random() < mob.dropChance) {
                    console.log(`You obtained ${mob.drop} from defeating ${mob.name}.`);
                    console.log(`[You obtained ${mob.money} gold from defeating ${mob.name}.]`);
                }

                if (this.player.xp >= this.player.maxXp) {
                    this.player.levelUp();
                }
                mob.hp = mob.max_hp;
            }
            console.log("After Attack - Player XP:", this.player.xp, "Max XP:", this.player.maxXp);
            // Update UI after the fight
            this.updatePlayerUI();
        }else{
            console.log("Experience property not found in mob:", mob);
        }
    }
        updatePlayerUI() {
            this.player.updateStats();
        }
}

class Game {
    constructor() {
        this.player = new Player();
        this.monsters = [];
        this.currentMap = null;
        this.initialize();
    }

    async initialize() {
        await this.fetchMonsters();
        this.displayMonster(this.monsters[0]); // Display the first monster by default
        this.setupEventListeners();
        this.updateUI();
    }

    async fetchMonsters() {
        try {
            const response = await fetch('mobs.json');
            const data = await response.json();
            this.monsters = data.mobs.map(monsterData => new Monster(monsterData.id, monsterData.name, monsterData.hp, monsterData.max_hp, monsterData.level, monsterData.exp,monsterData.damage, monsterData.money, monsterData.image, monsterData.dropChance, monsterData.drop));
            this.Experience = new Experience(this.player, this.monsters);
        } catch (error) {
            console.error('Error fetching monster data:', error);
        }
    }

    displayMonster(monster) {
        const monsterImage = document.querySelector(`[data-monster-id="${monster.id}"]`);
        if (monsterImage) {
            monsterImage.src = `img/${monster.image}`;
            monsterImage.alt = monster.name;
        }
    }

    attackMonster(monsterID) {
        this.Experience.pve(monsterID);
    }

    setupEventListeners() {
        // Implement event listeners as needed
    }

    changeMap(newMap) {
        const mapContainer = document.getElementById('screen');

        if (maps.hasOwnProperty(newMap)) {
            mapContainer.innerHTML = maps[newMap].content;
            this.currentMap = newMap;
            this.updateUI();
        } else {
            console.error('Map not found:', newMap);
        }
    }

    updateUI() {
        this.player.updateStats();
        // Implement additional UI updates for Game as needed
    }
}

const game = new Game();
