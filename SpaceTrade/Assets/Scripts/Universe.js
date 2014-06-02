//array of planet names
var vNames : String[];

//amount of sectors and planets per sector
var vSectorAmount : int;
var vPlanetAmount : int;

//prefabs
var vPlanet : GameObject;
var vWormhole : GameObject;
var vSun : GameObject;
var vShip : GameObject;
var vYard : GameObject;
var vMechanic : GameObject;
//icons for the planet screens
var vPlanetIcons : Texture2D[];
//icons for the menu screens
var vShipIcons : Texture2D[];
var vWeaponIcons : Texture2D[];
var vYardIcon : Texture2D;
var vMechanicIcon :Texture2D;
//gui style
var vGUI : GUISkin;
//icons fr fight screens
var vBattleIconsL : Texture2D[];
var vBattleIconsR : Texture2D[];
var rProjectile : Texture2D;
var lProjectile : Texture2D;
//enemy names
var vEName : String[];

//spawned ship
var vS : GameObject;
var vSS : Component;
//current ship class and stats
var vCS : cShip;

//enemy ship
var vES : cShip;

var vIconL : Texture2D;
var vIconR : Texture2D;

var lCounter : int;
var rCounter : int;

//position of th eprojectile on screen
var lProjPos : int;
var rProjPos : int;
//its speed
var ProjSpeed : float = 2000.0;

//is a projectile on screen?
var lProjVis : boolean = false;
var rProjVis : boolean = false;

//is a fight ongoing?
var vFighting : boolean = false;


//ship classes Array
var vSA = new Array();
//weapon classes array
var vWA = new Array();
//ship product inventory
var vSP = new Array();
//array of improvement levels on current ship
var vCU = new Array();
//array of weapon upgrade levels
var vCW = new Array();
//player money
var vMoney : int = 1000;
//player Name
var vName : String;
//Currently active sector
var vCurrSec : int = 0;
//parent object holding all sector objects
var vParentPref : GameObject;
var vParent : GameObject;
//array of all sectors
var vSectors = new Array();

//GUI components

var vCurrGUI : int = 0;
var vPrevGUI : int = 0;
var vPlanetGUI : Texture2D;
//current planet
var vCP : cPlanet;
//selected ship
var vSel : int;
//selected ugrade category 
//0-none, 1-ship, 2-weapons
var vCat : int = 0;
var vReward : int;


var baseP : float = 20.0;
var vP : float;
// The position on of the scrolling viewport
var scrollPosition : Vector2 = Vector2.zero;

//savefile components
var vSave : Component;
vSave = gameObject.GetComponent(Filesaver);
//
var vClick : AudioSource;
//single sector class
class cSector 
{
	var vNumber : int;
	var vPlanets = new Array();
	var vShipyards = new Array();
	var vMechanics = new Array();
	var vWormholeN : cWormhole;
	var vWormholeP : cWormhole;
	var vSun : cSun;
	
}
//single planet class
class cPlanet 
{
	var vName : String;
	var vPosX : int;
	var vPosY : int;
	var vPricefactor : float;
	var vProductionfactor : float;
	var vObject : GameObject;
	var vIcon : Texture2D;
	var vProducts = new Array();
	
}
//products list
class cProduct
{
	var vName : String;
	var vBasePrice : int;
	var vAmount : int;
}
//wormhole class
class cWormhole 
{
	var vDestination : int;
	var vPosX : int;
	var vPosY : int;
	var vObject : GameObject;
}
//sun class
class cSun
{
	var vPosX : int;
	var vPosY : int;
	var vEnergy : int;
	var vObject : GameObject;
}

//shipyard class
class cYard
{
	var vPosX : int;
	var vPosY : int;
	var vObject : GameObject;
}

//mechanic class
class cMechanic
{
	var vPosX : int;
	var vPosY : int;
	var vObject : GameObject;
}

//ship class
class cShip
{
	var vName : String;
	var vClass : String;
	var vPrice : int;
	var vIcon : Texture2D;
	var vSpeed : float;
	
	var vMaxFuel : float;
	var vFuel : float;
	var vFuelUse : float;
	
	var vMaxHP : int;
	var vHP : int;
	
	var vMaxShield : int;
	var vCurrShield : int;
	
	var vStorage : int;
	var vStorageUsed : int;
	
	var vWeapon : cWeapon;
	
}

//weapon class
class cWeapon
{
	var vName : String;
	var vDmg : int;
	var vReloadtime : int;
	var vIcon : Texture2D;
}

function Start () 
{

	if(PlayerPrefs.GetInt("mute") == 1)
		{

			AudioListener.pause = true;
		}
		else
		{

			AudioListener.pause = false;
		}
		vName = PlayerPrefs.GetString("Name");
	
	//set sector amount
	vSectors.length = PlayerPrefs.GetInt("SectorAmount");
	
	//fill the sector array with sectors
	var vCounter : int = 0;
	for (var s : cSector in vSectors) 
	{
		s = new cSector();
		s.vNumber = vCounter;
		vCounter++;
	}
	//fill the sectors with planets and wormholes to previous sector
	var vRND : int;
	var vRND2 : int;
	var fRND : float;
	for (var d : cSector in vSectors) 
	{
		//set amount of planets per sector
		d.vPlanets.length = PlayerPrefs.GetInt("PlanetAmount");;
		//fill information on each planet
		for (var f : cPlanet in d.vPlanets) 
		{
			f = new cPlanet();
			//give it a name
			vRND = Random.Range(0,vNames.length);
			vRND2 = Random.Range(0,1000);
			f.vName = vNames[vRND] + vRND2;
			//give it a Position
			vRND = Random.Range(-10,10);
			f.vPosX = vRND;
			vRND = Random.Range(-10,10);
			f.vPosY = vRND;
			//set prefab
			f.vObject = vPlanet;
			vRND = Random.Range(0,vPlanetIcons.length);
			f.vIcon = vPlanetIcons[vRND];
			//set random price and production factor
			fRND = Random.Range(0.2, 10.0);
			f.vProductionfactor = fRND;
			fRND = Random.Range(0.2, 2.0);
			f.vPricefactor = fRND;
			//set all products
			fFillProducts(f);
		}
		//add wormholes
		if(d.vNumber != 0)
		{
			d.vWormholeP = new cWormhole();
			d.vWormholeP.vPosX = 0;
			d.vWormholeP.vPosY = -11;
			d.vWormholeP.vDestination = d.vNumber -1;
			d.vWormholeP.vObject = vWormhole;
		}
		if(d.vNumber != vSectors.length-1)
		{
			d.vWormholeN = new cWormhole();
			d.vWormholeN.vPosX = 0;
			d.vWormholeN.vPosY = 11;
			d.vWormholeN.vDestination = d.vNumber +1;
			d.vWormholeN.vObject = vWormhole;
		}
		//add sun
		d.vSun = new cSun();
		d.vSun.vPosX = 0;
		d.vSun.vPosY = 0;
		vRND = Random.Range(0,256);
		d.vSun.vEnergy = vRND;
		d.vSun.vObject = vSun;
		//add shipyard
		d.vShipyards[0] = new cYard();
		vRND = Random.Range(-10,10);
		d.vShipyards[0].vPosX = vRND;
		vRND = Random.Range(-10,10);
		d.vShipyards[0].vPosY = vRND;
		d.vShipyards[0].vObject = vYard;
		//add mechanic
		d.vMechanics[0] = new cMechanic();
		vRND = Random.Range(-10,10);
		d.vMechanics[0].vPosX = vRND;
		vRND = Random.Range(-10,10);
		d.vMechanics[0].vPosY = vRND;
		d.vMechanics[0].vObject = vMechanic;
		
	}
	//fill ship inv
	fFillShip();
	RenderSector(0);
	vSS = vS.GetComponent(Ship);
	
	//fill weapon array
	fFillWeapons();
	
	//fill current ship stats with a ship class
	vCS = new cShip();
	fFillUpgrades();
	fFillWepgrades();
	fFillAllStats();
	fFillStats(0);
	fFillWep(0);
	
	//load file if necessary
	if(PlayerPrefs.GetInt("loading") == 1)
	{
		vSave.vUn = this;
		vSave.ReadFile("save.txt");
	}
	
}
//render a given sector
function RenderSector (s : int) 
{
	var vR : GameObject;
	if(vParent != null)
	{
		//destroy previous sector
		Destroy(vParent);
	}
	//create new sector parent
	vParent = Instantiate(vParentPref, transform.position, transform.rotation);
	
	//create player ship
	vS = Instantiate(vShip, new Vector3(0, 1.1, 0), new Quaternion(0,0,0,0));
	vS.GetComponent(Ship).vU = gameObject;
	vS.transform.parent = vParent.transform;
	//create sun
	
	vR = Instantiate(vSectors[s].vSun.vObject, new Vector3(vSectors[s].vSun.vPosX, 1, vSectors[s].vSun.vPosY), new Quaternion(0,0,0,0));
	vR.GetComponent(Sun).vReference = vSectors[s].vSun;
	vR.GetComponent(Sun).vShip = vS;
	vR.transform.parent = vParent.transform;
	
	//create planets
	for (var h : cPlanet in vSectors[s].vPlanets) 
	{
		vR = Instantiate(h.vObject, new Vector3(h.vPosX, 1, h.vPosY), new Quaternion(0,0,0,0));
		vR.GetComponent(Planet).vReference = h;
		vR.GetComponent(Planet).vShip = vS;
		vR.transform.parent = vParent.transform;
	}
	
	//create shipyards
	for (var sy : cYard in vSectors[s].vShipyards) 
	{
		vR = Instantiate(sy.vObject, new Vector3(sy.vPosX, 1, sy.vPosY), new Quaternion(0,0,0,0));
		vR.GetComponent(Yard).vReference = sy;
		vR.GetComponent(Yard).vShip = vS;
		vR.transform.parent = vParent.transform;
	}
	
	//create mechanics
	for (var mc : cMechanic in vSectors[s].vMechanics) 
	{
		vR = Instantiate(mc.vObject, new Vector3(mc.vPosX, 1, mc.vPosY), new Quaternion(0,0,0,0));
		vR.GetComponent(Mechanic).vReference = mc;
		vR.GetComponent(Mechanic).vShip = vS;
		vR.transform.parent = vParent.transform;
	}
	
	//create wormholes
	if(vSectors[s].vWormholeN != null)
	{
		vR = Instantiate(vSectors[s].vWormholeN.vObject, new Vector3(vSectors[s].vWormholeN.vPosX, 1, vSectors[s].vWormholeN.vPosY), new Quaternion(0,0,0,0));
		vR.GetComponent(Wormhole).vReference = vSectors[s].vWormholeN;
		vR.GetComponent(Wormhole).vShip = vS;
		vR.transform.parent = vParent.transform;
	}
	if(vSectors[s].vWormholeP != null)
	{
		vR = Instantiate(vSectors[s].vWormholeP.vObject, new Vector3(vSectors[s].vWormholeP.vPosX, 1, vSectors[s].vWormholeP.vPosY), new Quaternion(0,0,0,0));
		vR.GetComponent(Wormhole).vReference = vSectors[s].vWormholeP;
		vR.GetComponent(Wormhole).vShip = vS;
		vR.transform.parent = vParent.transform;
	}
	vCurrSec = s;
}

function Update()
{
	if(Input.GetKeyDown("escape"))
	{
		//if not in menu, go to menu
		if(vCurrGUI == 0)
		{
			
			vPrevGUI = vCurrGUI;
			vCurrGUI = 1;
		}
		//unless in fight, leave menu
		else //if(vCurrGUI != 5)
		{
			vCurrGUI = 0;
		}
	}
	if(Input.GetKeyDown("d"))
	{
		TriggerFight();
	}
	if(Input.GetKeyDown("m"))
	{
		if(PlayerPrefs.GetInt("mute") != 1)
		{
			PlayerPrefs.SetInt("mute", 1);
			AudioListener.pause = true;
		}
		else
		{
			PlayerPrefs.SetInt("mute", 0);
			AudioListener.pause = false;
		}
		PlayerPrefs.Save();
	}
	
	
	if(lProjVis == true)
	{
		lProjPos += (Time.deltaTime * ProjSpeed);
		if(lProjPos >= Screen.width-200)
		{
			lProjVis = false;
			lProjPos = 0;
		}
	}
	if(rProjVis == true)
	{
		rProjPos -= (Time.deltaTime * ProjSpeed);
		if(rProjPos <= 200)
		{
			rProjVis = false;
			rProjPos = Screen.width-200;
		}
	}
}


//0-none, 1-pause, 2-planet, 3-shipyard, 4-mechanic, 
//5-battle, 6-battle won, 7-battle lost, 8-battle fled
function OnGUI()
{
	GUI.skin = vGUI;
	//pause menu
	if(vCurrGUI == 1)
	{
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		//draw ship stats
		if(GUI.Button(Rect(10,10,200,133),vCS.vIcon, "label")){}
		GUI.Label(Rect(20,140,300,20), "Player: " + vName);
		GUI.Label(Rect(20,160,300,20), "Money: " + vMoney + " Cr");
		GUI.Label(Rect(20,200,300,20), "Ship: " + vCS.vName);
		GUI.Label(Rect(20,220,300,20), "Class: " + vCS.vClass);
		GUI.Label(Rect(20,240,300,20), "Hull: " + vCS.vHP + "/" + vCS.vMaxHP);
		GUI.Label(Rect(20,260,300,20), "Shields: " + vCS.vCurrShield + "/" + vCS.vMaxShield);
		GUI.Label(Rect(20,280,300,20), "Storage: " + vCS.vStorageUsed + "/" + vCS.vStorage);
		GUI.Label(Rect(20,300,300,20), "Fuel: " + vCS.vFuel + "/" + vCS.vMaxFuel);
		//draw weaon stats
		if(GUI.Button(Rect(Screen.width-210,10,200,133),vCS.vWeapon.vIcon, "label")){}
		GUI.Label(Rect(Screen.width-200,140,300,20), "Weapon: " + vCS.vWeapon.vName);
		GUI.Label(Rect(Screen.width-200,160,300,20), "Damage: " + vCS.vWeapon.vDmg);
		GUI.Label(Rect(Screen.width-200,180,300,20), "Reload: " + vCS.vWeapon.vReloadtime);

		
		DrawMenuButs();
	}
	//planet Menu
	if(vCurrGUI == 2)
	{
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		
		DrawMenuButs();
		
		if(GUI.Button(Rect(10,10,200,133),vCP.vIcon, "label")){}
		
		//draw planet stats
		GUI.Label(Rect(210,20,300,20), "Arrived at " + vCP.vName);
		GUI.Label(Rect(210,40,300,20), "Production factor: " + vCP.vProductionfactor);
		GUI.Label(Rect(210,60,300,20), "Player Money: " + vMoney + " Cr");
		GUI.Label(Rect(210,80,300,20), "Ship Storage: " + vCS.vStorageUsed + "/" + vCS.vStorage);
		GUI.Label(Rect(300,120,50,20), "Price");
		GUI.Label(Rect(370,120,50,20), "Amount");
		GUI.Label(Rect(790,120,50,20), "On Ship");
		//one goddamn product 0
		GUI.Label(Rect(210,140,100,20), vCP.vProducts[0].vName);
		GUI.Label(Rect(300,140,100,20), "" + vCP.vProducts[0].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,140,100,20), "" + vCP.vProducts[0].vAmount);
		GUI.Label(Rect(790,140,100,20), "" + vSP[0].vAmount);
		if(GUI.Button(Rect(420,140,80,20), "Buy 1"))
		{
			vClick.Play();
			if(vMoney >= vCP.vProducts[0].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(0);
					
				}
			}
		}
		
		if(GUI.Button(Rect(510,140,80,20), "Buy All"))
		{
			vClick.Play();
			while(vCP.vProducts[0].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[0].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(0);
				
			}
		}
		
		if(GUI.Button(Rect(600,140,80,20), "Sell 1"))
		{
			vClick.Play();
			if(vSP[0].vAmount >= 1)
			{
				fSellP(0);
			}
		}
		
		if(GUI.Button(Rect(690,140,80,20), "Sell All"))
		{
			vClick.Play();
			while(vSP[0].vAmount >= 1)
			{	
				fSellP(0);
			}
		}
		//one goddamn product 1
		GUI.Label(Rect(210,160,100,20), vCP.vProducts[1].vName);
		GUI.Label(Rect(300,160,100,20), "" + vCP.vProducts[1].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,160,100,20), "" + vCP.vProducts[1].vAmount);
		GUI.Label(Rect(790,160,100,20), "" + vSP[1].vAmount);
		if(GUI.Button(Rect(420,160,80,20), "Buy 1"))
		{
			vClick.Play();
			if(vMoney >= vCP.vProducts[1].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(1);
				}
			}
		}
		
		if(GUI.Button(Rect(510,160,80,20), "Buy All"))
		{
		vClick.Play();
			while(vCP.vProducts[1].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[1].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(1);
				
			}
		}
		
		if(GUI.Button(Rect(600,160,80,20), "Sell 1"))
		{
		vClick.Play();
			if(vSP[1].vAmount >= 1)
			{
				fSellP(1);
			}
		}
		
		if(GUI.Button(Rect(690,160,80,20), "Sell All"))
		{
		vClick.Play();
			while(vSP[1].vAmount >= 1)
			{	
				fSellP(1);
			}
		}
		//one goddamn product 2
		GUI.Label(Rect(210,180,100,20), vCP.vProducts[2].vName);
		GUI.Label(Rect(300,180,100,20), "" + vCP.vProducts[2].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,180,100,20), "" + vCP.vProducts[2].vAmount);
		GUI.Label(Rect(790,180,100,20), "" + vSP[2].vAmount);
		if(GUI.Button(Rect(420,180,80,20), "Buy 1"))
		{
		vClick.Play();
			if(vMoney >= vCP.vProducts[2].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(2);
				}
			}
		}
		
		if(GUI.Button(Rect(510,180,80,20), "Buy All"))
		{
		vClick.Play();
			while(vCP.vProducts[2].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[2].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(2);
				
			}
		}
		
		if(GUI.Button(Rect(600,180,80,20), "Sell 1"))
		{
		vClick.Play();
			if(vSP[2].vAmount >= 1)
			{
				fSellP(2);
			}
		}
		
		if(GUI.Button(Rect(690,180,80,20), "Sell All"))
		{
		vClick.Play();
			while(vSP[2].vAmount >= 1)
			{	
				fSellP(2);
			}
		}
		//one goddamn product 3
		GUI.Label(Rect(210,200,100,20), vCP.vProducts[3].vName);
		GUI.Label(Rect(300,200,100,20), "" + vCP.vProducts[3].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,200,100,20), "" + vCP.vProducts[3].vAmount);
		GUI.Label(Rect(790,200,100,20), "" + vSP[3].vAmount);
		if(GUI.Button(Rect(420,200,80,20), "Buy 1"))
		{
		vClick.Play();
			if(vMoney >= vCP.vProducts[3].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(3);
				}
			}
		}
		
		if(GUI.Button(Rect(510,200,80,20), "Buy All"))
		{
		vClick.Play();
			while(vCP.vProducts[3].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[3].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(3);
				
			}
		}
		
		if(GUI.Button(Rect(600,200,80,20), "Sell 1"))
		{
		vClick.Play();
			if(vSP[3].vAmount >= 1)
			{
				fSellP(3);
			}
		}
		
		if(GUI.Button(Rect(690,200,80,20), "Sell All"))
		{
		vClick.Play();
			while(vSP[3].vAmount >= 1)
			{	
				fSellP(3);
			}
		}
		//one goddamn product 4
		GUI.Label(Rect(210,220,100,20), vCP.vProducts[4].vName);
		GUI.Label(Rect(300,220,100,20), "" + vCP.vProducts[4].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,220,100,20), "" + vCP.vProducts[4].vAmount);
		GUI.Label(Rect(790,220,100,20), "" + vSP[4].vAmount);
		if(GUI.Button(Rect(420,220,80,20), "Buy 1"))
		{
		vClick.Play();
			if(vMoney >= vCP.vProducts[4].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(4);
				}
			}
		}
		
		if(GUI.Button(Rect(510,220,80,20), "Buy All"))
		{
		vClick.Play();
			while(vCP.vProducts[4].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[4].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(4);
				
			}
		}
		
		if(GUI.Button(Rect(600,220,80,20), "Sell 1"))
		{
		vClick.Play();
			if(vSP[4].vAmount >= 1)
			{
				fSellP(4);
			}
		}
		
		if(GUI.Button(Rect(690,220,80,20), "Sell All"))
		{
		vClick.Play();
			while(vSP[4].vAmount >= 1)
			{	
				fSellP(4);
			}
		}
		//one goddamn product 5
		GUI.Label(Rect(210,240,100,20), vCP.vProducts[5].vName);
		GUI.Label(Rect(300,240,100,20), "" + vCP.vProducts[5].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,240,100,20), "" + vCP.vProducts[5].vAmount);
		GUI.Label(Rect(790,240,100,20), "" + vSP[5].vAmount);
		if(GUI.Button(Rect(420,240,80,20), "Buy 1"))
		{
		vClick.Play();
			if(vMoney >= vCP.vProducts[5].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(5);
				}
			}
		}
		
		if(GUI.Button(Rect(510,240,80,20), "Buy All"))
		{
		vClick.Play();
			while(vCP.vProducts[5].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[5].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(5);
				
			}
		}
		
		if(GUI.Button(Rect(600,240,80,20), "Sell 1"))
		{
		vClick.Play();
			if(vSP[5].vAmount >= 1)
			{
				fSellP(5);
			}
		}
		
		if(GUI.Button(Rect(690,240,80,20), "Sell All"))
		{
		vClick.Play();
			while(vSP[5].vAmount >= 1)
			{	
				fSellP(5);
			}
		}
		//one goddamn product 6
		GUI.Label(Rect(210,260,100,20), vCP.vProducts[6].vName);
		GUI.Label(Rect(300,260,100,20), "" + vCP.vProducts[6].vBasePrice * vCP.vPricefactor);
		GUI.Label(Rect(370,260,100,20), "" + vCP.vProducts[6].vAmount);
		GUI.Label(Rect(790,260,100,20), "" + vSP[6].vAmount);
		if(GUI.Button(Rect(420,260,80,20), "Buy 1"))
		{
		vClick.Play();
			if(vMoney >= vCP.vProducts[6].vBasePrice * vCP.vPricefactor)
			{
				if(vCS.vStorageUsed < vCS.vStorage){
					fBuyP(6);
				}
			}
		}
		
		if(GUI.Button(Rect(510,260,80,20), "Buy All"))
		{
		vClick.Play();
			while(vCP.vProducts[6].vAmount >= 1 && vCS.vStorageUsed < vCS.vStorage && vMoney >= vCP.vProducts[6].vBasePrice * vCP.vPricefactor)
			{
				
				fBuyP(6);
				
			}
		}
		
		if(GUI.Button(Rect(600,260,80,20), "Sell 1"))
		{
		vClick.Play();
			if(vSP[6].vAmount >= 1)
			{
				fSellP(6);
			}
		}
		
		if(GUI.Button(Rect(690,260,80,20), "Sell All"))
		{
		vClick.Play();
			while(vSP[6].vAmount >= 1)
			{	
				fSellP(6);
			}
		}
		
		//Fuel Buttons
		GUI.Label(Rect(210,280,100,20), "Fuel: ");
		GUI.Label(Rect(300,280,100,20), "1");
		GUI.Label(Rect(790,280,100,20), "" + vCS.vFuel + "/" + vCS.vMaxFuel);
		if(GUI.Button(Rect(420,280,80,20), "Buy 1 l"))
		{
		vClick.Play();
			BuyFuel();
		}
		
		if(GUI.Button(Rect(510,280,80,20), "Fill up"))
		{
			while(vMoney >= 1 && vCS.vFuel < vCS.vMaxFuel)
			{
				vClick.Play();
				BuyFuel();
				
			}
		}
		
	}
	//shipyard menu
	if(vCurrGUI == 3)
	{
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		
		if(GUI.Button(Rect(10,10,200,133),vYardIcon, "label")){}
		
		GUI.Label(Rect(250,20,300,20), "Arrived at shipyard");
		GUI.Label(Rect(250,40,300,20), "Player Money: " + vMoney + " Cr");
		
		DrawMenuButs();
		scrollPosition = GUI.BeginScrollView (Rect (10,140,220,Screen.height-250),scrollPosition, Rect (0, 0, 201, vSA.length * 140));
		//draw ships on sale
		if(GUI.Button(Rect(0,0,200,133),vSA[0].vIcon, "label"))
		{
		vClick.Play();
			vSel = 0;
		}
		
		if(GUI.Button(Rect(0,140,200,133),vSA[1].vIcon, "label"))
		{
		vClick.Play();
			vSel = 1;
		}
		if(GUI.Button(Rect(0,280,200,133),vSA[2].vIcon, "label"))
		{
		vClick.Play();
			vSel = 2;
		}
		if(GUI.Button(Rect(0,420,200,133),vSA[3].vIcon, "label"))
		{
		vClick.Play();
			vSel = 3;
		}
		if(GUI.Button(Rect(0,560,200,133),vSA[4].vIcon, "label"))
		{
		vClick.Play();
			vSel = 4;
		}
		
		GUI.EndScrollView ();
		//show stat comparison
		GUI.Label(Rect(385,120,100,20), "Current");
		GUI.Label(Rect(320,120,100,20), "Selected");
		
		GUI.Label(Rect(250,140,100,20), "Price: ");
		GUI.Label(Rect(320,140,100,20), "" + vSA[vSel].vPrice + " Cr");
		GUI.Label(Rect(385,140,100,20), "" + vCS.vPrice + " Cr");
		
		GUI.Label(Rect(250,160,100,20), "Class: ");
		GUI.Label(Rect(320,160,100,20), "" + vSA[vSel].vClass);
		GUI.Label(Rect(385,160,100,20), "" + vCS.vClass);
		
		GUI.Label(Rect(250,180,100,20), "Speed: ");
		GUI.Label(Rect(320,180,100,20), "" + vSA[vSel].vSpeed);
		GUI.Label(Rect(385,180,100,20), "" + vCS.vSpeed);
		
		GUI.Label(Rect(250,200,100,20), "Fuel cap.: ");
		GUI.Label(Rect(320,200,100,20), "" + vSA[vSel].vMaxFuel + "l");
		GUI.Label(Rect(385,200,100,20), "" + vCS.vMaxFuel + "l");
		
		GUI.Label(Rect(250,220,100,20), "Hull: ");
		GUI.Label(Rect(320,220,100,20), "" + vSA[vSel].vMaxHP);
		GUI.Label(Rect(385,220,100,20), "" + vCS.vMaxHP);
		
		GUI.Label(Rect(250,240,100,20), "Shields: ");
		GUI.Label(Rect(320,240,100,20), "" + vSA[vSel].vMaxShield);
		GUI.Label(Rect(385,240,100,20), "" + vCS.vMaxShield);
		
		GUI.Label(Rect(250,260,100,20), "Storage: ");
		GUI.Label(Rect(320,260,100,20), "" + vSA[vSel].vStorage);
		GUI.Label(Rect(385,260,100,20), "" + vCS.vStorage);
		//draw buy button
		if(GUI.Button(Rect(250,280,60,20),"Buy"))
		{
		vClick.Play();
			if(vSA[vSel].vPrice <= vMoney)
			{
				vMoney = vMoney -vSA[vSel].vPrice;
				fFillStats(vSel);
			}
		}
		
		//Fuel Buttons
		GUI.Label(Rect(250,300,100,20), "Fuel: ");
		GUI.Label(Rect(385,300,100,20), "" + vCS.vFuel + "/" + vCS.vMaxFuel);
		if(GUI.Button(Rect(250,320,80,20), "Buy 1 l"))
		{
		vClick.Play();
			BuyFuel();
		}
		
		if(GUI.Button(Rect(340,320,80,20), "Fill up"))
		{
		vClick.Play();
			while(vMoney >= 1 && vCS.vFuel < vCS.vMaxFuel)
			{
				
				BuyFuel();
				
			}
		}
	}
	
	//mechanic Menu 
	if(vCurrGUI == 4)
	{
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		DrawMenuButs();
		if(GUI.Button(Rect(10,10,200,133),vMechanicIcon, "label")){}
		
		GUI.Label(Rect(250,20,300,20), "Arrived at ship mechanic");
		GUI.Label(Rect(250,40,300,20), "Player Money: " + vMoney + " Cr");
		//draw category buttons
		if(GUI.Button(Rect(10,160,125,20), "Ship Upgrades"))
		{
		vClick.Play();
			vCat = 0;
		}
		if(GUI.Button(Rect(135,160,125,20), "Weapon Upgrades"))
		{
		vClick.Play();
			vCat = 1;
		}
		if(vCat == 1)
		{
			DrawWepUpg();
		}
		else
		{
			DrawShipUpg();
		}
	}
	//battle Menu 
	if(vCurrGUI == 5)
	{
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		GUI.Box(Rect(-200,-200,Screen.width+400,Screen.height+400),"");
		
		if(GUI.Button(Rect(0,0,300,200),vIconL, "label")){}
		if(GUI.Button(Rect(Screen.width-300,0,300,200),vIconR, "label")){}
		
		GUI.Label(Rect(Screen.width/2-150,230,300,20), "Encountered: " + vES.vName);
		GUI.Label(Rect(Screen.width/2-150,250,300,20), "Hull: " + vCS.vHP + "/" + vCS.vMaxHP);
		GUI.Label(Rect(Screen.width/2-150,270,300,20), "Shield: " + vCS.vCurrShield + "/" + vCS.vMaxShield);
		if(GUI.Button(Rect(10,Screen.height-60,100,20), "Flee Battle"))
		{
		vClick.Play();
			FleeBattle();
		}
		Battle();
		//projectile display
		if(lProjVis == true){
			if(GUI.Button(Rect(lProjPos,110,100,50),rProjectile, "label")){}}
		
		if(rProjVis == true){
			if(GUI.Button(Rect(rProjPos,110,100,50),lProjectile, "label")){}}
		//flee
		
		
	}
	//battle win Menu 
	if(vCurrGUI == 6)
	{
		GUI.Box(Rect(Screen.width/2-100,Screen.height/2-100,200,200),"");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-80,300,20), "You won! ");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-60,300,20), vCS.vHP + " HP left!");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-40,300,20), vReward + " Cr gained!");
		if(GUI.Button(Rect(Screen.width/2-90,Screen.height/2+40,180,50), "Confirm"))
		{
		vClick.Play();
			vCurrGUI = 0;
		}
		
	}
	//battle loss Menu 
	if(vCurrGUI == 7)
	{
		GUI.Box(Rect(Screen.width/2-100,Screen.height/2-100,200,200),"");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-80,300,20), "You lost to " + vES.vName + "!");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-60,300,20), vES.vHP + " Enemy HP left!");

		if(GUI.Button(Rect(Screen.width/2-90,Screen.height/2+40,180,50), "Main Menu"))
		{
		vClick.Play();
			//Lost, go to main menu or load
			Application.LoadLevel("Main");
		}
		
	}
	//battle fled Menu 
	if(vCurrGUI == 8)
	{
		GUI.Box(Rect(Screen.width/2-100,Screen.height/2-100,200,200),"");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-80,300,20), "You fled " + vES.vName + "!");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-60,300,20), "You lose 10% of your credits");
		GUI.Label(Rect(Screen.width/2-90,Screen.height/2-40,300,20), "and your inventory!");

		if(GUI.Button(Rect(Screen.width/2-90,Screen.height/2+40,180,50), "Confirm"))
		{
		vClick.Play();
			vCurrGUI = 0;
		}
		
	}
	

}

function Battle()
{
	if(vFighting == true)
	{
		//increment both cooldowns
		lCounter++;
		rCounter++;
		//if counter exceeds weapon cooldown, shoot
		if(lCounter >= vCS.vWeapon.vReloadtime)
		{
			ShootRight();
			//reset counter
			lCounter = 0;
			//deal damage
			//if enemy has no shield
			if(vES.vCurrShield <= 0)
			{
				vES.vHP = vES.vHP - vCS.vWeapon.vDmg;
				if(vES.vHP <= 0)
				{
					//win fight
					vFighting = false;
					vReward = Random.Range(0,1000);
					vMoney += vReward;
					vCurrGUI = 6;
				}
			}
			else//take down shield 
			{
				vES.vCurrShield--;
			}
		}
		
		//if enemy exceeds weapon cooldown, shoot
		if(rCounter >= vES.vWeapon.vReloadtime)
		{ShootLeft();
			//reset counter
			rCounter = 0;
			//deal damage
			//if enemy has no shield
			if(vCS.vCurrShield <= 0)
			{
				vCS.vHP = vCS.vHP - vES.vWeapon.vDmg;
				if(vCS.vHP <= 0)
				{
					//lose fight
					vFighting = false;
					vCurrGUI = 7;
				}
			}
			else//take down shield 
			{
				vCS.vCurrShield--;
			}
		}}
}
//shoots a projectile to the right
function ShootRight()
{
	lProjPos = 200;
	lProjVis = true;
	
}
//shoot to th eleft
function ShootLeft()
{
	
	rProjPos = Screen.width-200;
	rProjVis = true;
}

function FleeBattle()
{
	//flee fight
	vFighting = false;
	fFillShip();
	vMoney = vMoney * 0.9;
	vCurrGUI = 8;
}

function SetBattleShip()
{
	if(vCS.vClass == "Capsule")
	{
		vIconL = vBattleIconsL[0];
	}
	
	if(vCS.vClass == "Fighter")
	{
		vIconL = vBattleIconsL[1];
	}
	
	if(vCS.vClass == "Corvette")
	{
		vIconL = vBattleIconsL[2];
	}
	
	if(vCS.vClass == "Freighter")
	{
		vIconL = vBattleIconsL[3];
	}
	
	if(vCS.vClass == "Cruiser")
	{
		vIconL = vBattleIconsL[4];
	}
	
}

//draws ship upgrade buttons
function DrawShipUpg()
{
	GUI.Label(Rect(270,180,300,20), "Current");
	//engine button
	var temp = vCU[0];
	temp++;
	vP = baseP * Mathf.Pow(1.25, temp);
	if(GUI.Button(Rect(10,200,250,20), "Engine Upgrade Mk." + temp + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			vCS.vSpeed = vCS.vSpeed * 1.2;
			vMoney = vMoney - vP;
			vCU[0] = temp;
		}
	}
	GUI.Label(Rect(270,200,300,20), vCS.vSpeed + " m/s");
	
	//health button
	var temp1 = vCU[1];
	temp1++;
	vP = baseP * Mathf.Pow(1.25, temp1);
	if(GUI.Button(Rect(10,220,250,20), "Hull Upgrade Mk." + temp1 + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			vCS.vMaxHP = vCS.vMaxHP * 1.2;
			vCS.vHP = vCS.vMaxHP;
			vMoney = vMoney - vP;
			vCU[1] = temp1;
		}
	}
	GUI.Label(Rect(270,220,300,20), vCS.vHP + "/" +vCS.vMaxHP + " HP");
	if(vCS.vHP < vCS.vMaxHP){
	if(GUI.Button(Rect(330,220,100,20), "Repair : 100 Cr"))
	{
	vClick.Play();
		vCS.vHP = vCS.vMaxHP;
	}}
	//shield button
	var temp2 = vCU[2];
	temp2++;
	vP = baseP * Mathf.Pow(1.25, temp2);
	if(GUI.Button(Rect(10,240,250,20), "Shield Upgrade Mk." + temp2 + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			if(vCS.vMaxShield > 0)
			{
				vCS.vMaxShield = vCS.vMaxShield + 1;
				vCS.vCurrShield = vCS.vMaxShield;
				vMoney = vMoney - vP;
				vCU[2] = temp2;
			}
			else
			{
				vCS.vMaxShield = 1;
				vCS.vCurrShield = vCS.vMaxShield;
				vMoney = vMoney - vP;
				vCU[2] = temp2;
			}
		}
	}
	GUI.Label(Rect(270,240,300,20), vCS.vMaxShield + " P");
	//Storage button
	var temp3 = vCU[3];
	temp3++;
	vP = baseP * Mathf.Pow(1.25, temp3);
	if(GUI.Button(Rect(10,260,250,20), "Storage Upgrade Mk." + temp3 + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			
			vCS.vStorage = vCS.vStorage * 1.2;
			vMoney = vMoney - vP;
			vCU[3] = temp3;
			
		}
	}
	GUI.Label(Rect(270,260,300,20), vCS.vStorage + " m³");
}
//draws weapon upgrade buttons
function DrawWepUpg()
{
	GUI.Label(Rect(270,180,300,20), "Current");
	//machine button
	vP = 1000;
	if(GUI.Button(Rect(10,200,250,20), "Machine Gun" + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			vCS.vWeapon = new cWeapon();
			vCS.vWeapon.vName = vWA[0].vName;
			vCS.vWeapon.vDmg = vWA[0].vDmg;
			vCS.vWeapon.vReloadtime = vWA[0].vReloadtime;
			vCS.vWeapon.vIcon = vWA[0].vIcon;
			vMoney = vMoney - vP;
		}
	}
	GUI.Label(Rect(270,200,300,20), vCS.vWeapon.vName);
	//laser button
	vP = 10000;
	if(GUI.Button(Rect(10,220,250,20), "Laser Gun" + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			vCS.vWeapon = new cWeapon();
			vCS.vWeapon.vName = vWA[1].vName;
			vCS.vWeapon.vDmg = vWA[1].vDmg;
			vCS.vWeapon.vReloadtime = vWA[1].vReloadtime;
			vCS.vWeapon.vIcon = vWA[1].vIcon;
			vMoney = vMoney - vP;
		}
	}
	GUI.Label(Rect(270,220,300,20), vCS.vWeapon.vName);
	//ion button
	vP = 40000;
	if(GUI.Button(Rect(10,240,250,20), "Ion Gun" + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			vCS.vWeapon = new cWeapon();
			vCS.vWeapon.vName = vWA[2].vName;
			vCS.vWeapon.vDmg = vWA[2].vDmg;
			vCS.vWeapon.vReloadtime = vWA[2].vReloadtime;
			vCS.vWeapon.vIcon = vWA[2].vIcon;
			vMoney = vMoney - vP;
		}
	}
	GUI.Label(Rect(270,240,300,20), vCS.vWeapon.vName);
	//dmg button
	var tempD = vCW[0];
	tempD++;
	vP = baseP * Mathf.Pow(1.25, tempD);
	if(GUI.Button(Rect(10,260,250,20), "Damage Upgrade Mk." + tempD + " : " + vP + " Cr"))
	{
	vClick.Play();
		if(vMoney >= vP)
		{
			vCS.vWeapon.vDmg++;
			vCS.vWeapon.vDmg = vCS.vWeapon.vDmg * 1.5;
			vMoney = vMoney - vP;
			vCW[0] = tempD;
		}
	}
	GUI.Label(Rect(270,260,300,20), vCS.vWeapon.vDmg + " P");
}
//draws general menu buttons
function DrawMenuButs()
{
	if(GUI.Button(Rect(10,Screen.height-40,60,20),"Back"))
	{
	vClick.Play();
		vCurrGUI = 0;
	}
	if(GUI.Button(Rect(80,Screen.height-40,60,20),"Save"))
	{
	vClick.Play();
		print("File saved!");
		vSave.SaveFile("save.txt");
	}
	if(GUI.Button(Rect(150,Screen.height-40,60,20),"Load"))
	{
	vClick.Play();
		vSave.ReadFile("save.txt");
	}
	if(GUI.Button(Rect(220,Screen.height-40,60,20),"Quit"))
	{
	vClick.Play();
		print("Application terminated");
		Application.Quit();
	}
}
//buys one product
function fBuyP(prod : int)
{

	vSP[prod].vAmount = vSP[prod].vAmount+1;
	vMoney -= vCP.vProducts[prod].vBasePrice * vCP.vPricefactor;
	vCP.vProducts[prod].vAmount = vCP.vProducts[prod].vAmount-1;
	vCS.vStorageUsed = vCS.vStorageUsed+1;

}
//sells one product
function fSellP(prodc : int)
{
	vSP[prodc].vAmount = vSP[prodc].vAmount-1;
	vMoney += vCP.vProducts[prodc].vBasePrice * vCP.vPricefactor;
	vCP.vProducts[prodc].vAmount = vCP.vProducts[prodc].vAmount+1;
	vCS.vStorageUsed = vCS.vStorageUsed-1;
}
//activated on arrival
function PlanetArrival(i : cPlanet)
{
	print("Arrived at planet " + i.vName);
	vCP = i;
	vCurrGUI = 2;
}

function WormholeArrival(o : int)
{
	RenderSector(o);
}

function SunArrival()
{
	print("Arrived at a sun");
}

function ShipyardArrival()
{
	print("Arrived at shipyard");
	vCurrGUI = 3;
}

function MechArrival()
{
	print("Arrived at mechanic");
	vCurrGUI = 4;
}
//uses up 1 shipspecific unit of fuel
function UseFuel()
{
	vCS.vFuel = vCS.vFuel - vCS.vFuelUse;
	if (vCS.vFuel <= 0)
	{
		//call game over function
	}
}
//buys 1 fuel unit
function BuyFuel()
{
	if(vCS.vFuel < vCS.vMaxFuel)
	{
		vMoney--;
		vCS.vFuel++;
	}
}
function TriggerFight()
{
	
	GenerateEnemy();
	SetBattleShip();
	var rnd = Random.Range(0,vBattleIconsR.length);
	vIconR = vBattleIconsR[rnd];
	
	lCounter = 0;
	rCounter = 0;
	
	//open battle gui
	vCurrGUI = 5;
	vFighting = true;
	
	
}
//generates a random enemy of randm class
function GenerateEnemy()
{
	vES = new cShip();
	vES.vWeapon = new cWeapon();
	var vN : int;
	var vF : float;
	vN = Random.Range(0,vEName.length);
	vES.vName = vEName[vN];
	vN = Random.Range(0,vCS.vHP*2);
	vES.vMaxHP = vN;
	vES.vHP = vES.vMaxHP;
	vN = Random.Range(0,vCS.vMaxShield*1.3);
	vES.vMaxShield = vN;
	vES.vCurrShield = vES.vMaxShield;
	
	vN = Random.Range(vCS.vWeapon.vDmg*0.5,vCS.vWeapon.vDmg*3);
	vN++;
	vES.vWeapon.vDmg = vN;
	vN = Random.Range(1,vCS.vWeapon.vReloadtime*2);
	vES.vWeapon.vReloadtime = vN;
	
}
//finds the correct ship and weapon icons after loading
function FindIcon()
{
	for(var ship : cShip in vSA)
	{	
		if(vCS.vClass == ship.vClass)
		{
			vCS.vIcon = [ship].vIcon;
		}
	}
	for(var wep : cWeapon in vWA)
	{	
		if(vCS.vWeapon.vName == wep.vName)
		{
			vCS.vWeapon.vIcon = [wep].vIcon;
		}
	}
}
//////////////////////////////////////////
//Stat filling functions
//fills the ship with not upgraded systems
function fFillUpgrades()
{
	//speed
	vCU[0] = 0;
	//health
	vCU[1] = 0;
	//shield
	vCU[2] = 0;
	//storage
	vCU[3] = 0;
}
//fills the weapon with non upgraded systems
function fFillWepgrades()
{
	//dmg
	vCW[0] = 0;
	//reloadtime
	vCW[1] = 0;
}
//fills the ship inv array with names and 0 amounts
function fFillShip()
{
	vSP.length = 7;
	
	vSP[0] = new cProduct();
	vSP[0].vName = "Food";
	vSP[0].vAmount = 0;
	vSP[1] = new cProduct();
	vSP[1].vName = "Textiles";
	vSP[1].vAmount = 0;
	vSP[2] = new cProduct();
	vSP[2].vName = "Wood";
	vSP[2].vAmount = 0;
	vSP[3] = new cProduct();
	vSP[3].vName = "Metal";
	vSP[3].vAmount = 0;
	vSP[4] = new cProduct();
	vSP[4].vName = "Medicine";
	vSP[4].vAmount = 0;
	vSP[5] = new cProduct();
	vSP[5].vName = "Computerchips";
	vSP[5].vAmount = 0;
	vSP[6] = new cProduct();
	vSP[6].vName = "Jewelry";
	vSP[6].vAmount = 0;
}
//fills array of all ships. add new ships here.
function fFillAllStats()
{
	vSA.length = 5;
	//////////
	vSA[0] = new cShip();
	vSA[0].vName = "Capsule";
	vSA[0].vClass = vSA[0].vName;
	vSA[0].vPrice = 1000;
	vSA[0].vIcon = vShipIcons[0];
	vSA[0].vSpeed = 0.5;
	
	vSA[0].vMaxFuel = 100.0;
	vSA[0].vFuel = vSA[0].vMaxFuel;
	vSA[0].vFuelUse = 1.0;
	
	vSA[0].vMaxHP = 10;
	vSA[0].vHP = vSA[0].vMaxHP;
	
	vSA[0].vMaxShield = 0;
	vSA[0].vCurrShield = vSA[0].vMaxShield;
	
	vSA[0].vStorage = 10;
	vSA[0].vStorageUsed = 0;
	
	vSA[0].vWeapon = vWA[0];
	///////////////
	vSA[1] = new cShip();
	vSA[1].vName = "Fighter";
	vSA[1].vClass = vSA[1].vName;
	vSA[1].vPrice = 10000;
	vSA[1].vIcon = vShipIcons[1];
	vSA[1].vSpeed = 2.0;
	
	vSA[1].vMaxFuel = 300.0;
	vSA[1].vFuel = vSA[1].vMaxFuel;
	vSA[1].vFuelUse = 1.5;
	
	vSA[1].vMaxHP = 100;
	vSA[1].vHP = vSA[1].vMaxHP;
	
	vSA[1].vMaxShield = 10;
	vSA[1].vCurrShield = vSA[1].vMaxShield;
	
	vSA[1].vStorage = 50;
	vSA[1].vStorageUsed = 0;
	
	vSA[1].vWeapon = vWA[0];
	///////////////
	vSA[2] = new cShip();
	vSA[2].vName = "Corvette";
	vSA[2].vClass = vSA[2].vName;
	vSA[2].vPrice = 60000;
	vSA[2].vIcon = vShipIcons[2];
	vSA[2].vSpeed = 2.0;
	
	vSA[2].vMaxFuel = 1000.0;
	vSA[2].vFuel = vSA[2].vMaxFuel;
	vSA[2].vFuelUse = 2.0;
	
	vSA[2].vMaxHP = 400;
	vSA[2].vHP = vSA[2].vMaxHP;
	
	vSA[2].vMaxShield = 100;
	vSA[2].vCurrShield = vSA[2].vMaxShield;
	
	vSA[2].vStorage = 300;
	vSA[2].vStorageUsed = 0;
	
	vSA[2].vWeapon = vWA[1];
	///////////////
	vSA[3] = new cShip();
	vSA[3].vName = "Freighter";
	vSA[3].vClass = vSA[3].vName;
	vSA[3].vPrice = 80000;
	vSA[3].vIcon = vShipIcons[3];
	vSA[3].vSpeed = 1.0;
	
	vSA[3].vMaxFuel = 10000.0;
	vSA[3].vFuel = vSA[3].vMaxFuel;
	vSA[3].vFuelUse = 5.0;
	
	vSA[3].vMaxHP = 250;
	vSA[3].vHP = vSA[3].vMaxHP;
	
	vSA[3].vMaxShield = 1000;
	vSA[3].vCurrShield = vSA[3].vMaxShield;
	
	vSA[3].vStorage = 2000;
	vSA[3].vStorageUsed = 0;
	
	vSA[3].vWeapon = vWA[0];
	///////////////
	vSA[4] = new cShip();
	vSA[4].vName = "Cruiser";
	vSA[4].vClass = vSA[3].vName;
	vSA[4].vPrice = 200000;
	vSA[4].vIcon = vShipIcons[4];
	vSA[4].vSpeed = 1.0;
	
	vSA[4].vMaxFuel = 10000.0;
	vSA[4].vFuel = vSA[3].vMaxFuel;
	vSA[4].vFuelUse = 10.0;
	
	vSA[4].vMaxHP = 5000;
	vSA[4].vHP = vSA[4].vMaxHP;
	
	vSA[4].vMaxShield = 5000;
	vSA[4].vCurrShield = vSA[4].vMaxShield;
	
	vSA[4].vStorage = 5000;
	vSA[4].vStorageUsed = 0;
	
	vSA[4].vWeapon = vWA[2];
}
//fills array with all weapon types. add weapons here.
function fFillWeapons()
{
	vWA.length = 3;
	
	vWA[0] = new cWeapon();
	vWA[0].vName = "Machine Gun";
	vWA[0].vDmg = 1;
	vWA[0].vReloadtime = 1000;
	vWA[0].vIcon = vWeaponIcons[0];
	
	vWA[1] = new cWeapon();
	vWA[1].vName = "Laser Gun";
	vWA[1].vDmg = 10;
	vWA[1].vReloadtime = 700;
	vWA[1].vIcon = vWeaponIcons[1];
	
	vWA[2] = new cWeapon();
	vWA[2].vName = "Ion Cannon";
	vWA[2].vDmg = 40;
	vWA[2].vReloadtime = 800;
	vWA[2].vIcon = vWeaponIcons[2];
}
//fils the current ship with given ship stats
function fFillStats(tm : int)
{
	vCS.vName = vSA[tm].vName;
	vCS.vClass = vSA[tm].vClass;
	vCS.vPrice = vSA[tm].vPrice;
	vCS.vIcon = vSA[tm].vIcon;
	vCS.vSpeed = vSA[tm].vSpeed;
	
	vCS.vMaxFuel = vSA[tm].vMaxFuel;
	vCS.vFuel = vSA[tm].vFuel;
	vCS.vFuelUse = vSA[tm].vFuelUse;
	
	vCS.vMaxHP = vSA[tm].vMaxHP;
	vCS.vHP = vSA[tm].vHP;
	
	vCS.vMaxShield = vSA[tm].vMaxShield;
	vCS.vCurrShield = vSA[tm].vCurrShield;
	
	vCS.vStorage = vSA[tm].vStorage;
	//vCS.vStorageUsed = vSA[tm].vStorageUsed;
	
	vCS.vWeapon = vSA[tm].vWeapon;
	
	fFillUpgrades();
}
//fills the current weapon with stats
function fFillWep(tw : int)
{
	vCS.vWeapon = new cWeapon();
	vCS.vWeapon.vName = vWA[tw].vName;
	vCS.vWeapon.vDmg = vWA[tw].vDmg;
	vCS.vWeapon.vReloadtime = vWA[tw].vReloadtime;
	vCS.vWeapon.vIcon = vWA[tw].vIcon;
	fFillWepgrades();
}
//fill one planet with all products. add products here.
function fFillProducts(p : cPlanet)
{
	p.vProducts.length = 7;
	var vR : int;
	p.vProducts[0] = new cProduct();
	p.vProducts[0].vName = "Food";
	p.vProducts[0].vBasePrice = 100;
	
	vR = Random.Range(0, 200);
	p.vProducts[0].vAmount = vR;
	
	p.vProducts[1] = new cProduct();
	p.vProducts[1].vName = "Textiles";
	p.vProducts[1].vBasePrice = 130;

	vR = Random.Range(0, 200);
	p.vProducts[1].vAmount = vR;
	
	p.vProducts[2] = new cProduct();
	p.vProducts[2].vName = "Wood";
	p.vProducts[2].vBasePrice = 70;

	vR = Random.Range(0, 200);
	p.vProducts[2].vAmount = vR;
	
	p.vProducts[3] = new cProduct();
	p.vProducts[3].vName = "Metal";
	p.vProducts[3].vBasePrice = 90;

	vR = Random.Range(0, 200);
	p.vProducts[3].vAmount = vR;
	
	p.vProducts[4] = new cProduct();
	p.vProducts[4].vName = "Medicine";
	p.vProducts[4].vBasePrice = 90;

	vR = Random.Range(0, 200);
	p.vProducts[4].vAmount = vR;
	
	p.vProducts[5] = new cProduct();
	p.vProducts[5].vName = "Computerchips";
	p.vProducts[5].vBasePrice = 200;

	vR = Random.Range(0, 200);
	p.vProducts[5].vAmount = vR;
	
	p.vProducts[6] = new cProduct();
	p.vProducts[6].vName = "Jewelry";
	p.vProducts[6].vBasePrice = 500;

	vR = Random.Range(0, 200);
	p.vProducts[6].vAmount = vR;
}
