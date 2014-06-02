//destination object
var vDestObj : GameObject;
//arrival distance
var vDestDist : float = 1.0;

//universe object and script
var vU : GameObject;
var vUn : Component;

vUn = vU.GetComponent(Universe);

//fuel counter
var vFuelC : int = 0;

//random
var vRa : int;
var vRc : int = 0;


function Update () 
{
	//freezes ship rotation on unwatned axes
	transform.position.y = 1.1;
	transform.rotation.x = 0;
	transform.rotation.z = 0;
	//if ship has a destination, look at and move towards it
	if(vDestObj != null)
	{
		
		//increase fuel counter
		vFuelC++;
		//if counter exceeds a given number, reset it and send order to decrease fuel
		if(vFuelC >= 1000)
		{
			vFuelC = 0;
			vUn.UseFuel();
		}
		if(vUn.vCurrGUI == 0)
		{
		if(Vector3.Distance(transform.position, vDestObj.transform.position) >= vDestDist)
		{
			transform.LookAt(vDestObj.transform);
			transform.Translate(Vector3.forward * Time.deltaTime * vUn.vCS.vSpeed);
			vRc++;
			if(vRc >= 5000)
			{
				vRc = 0;
				vRa = Random.Range(0,100);
				if(vRa <= 10)
				{
					vUn.TriggerFight();
				}
			}
		}
		else
		{	
			//once there, determine type, tell the universe script you arrived and delete destination
			if(vDestObj.GetComponent(Planet) != null)
			{
				vUn.PlanetArrival(vDestObj.GetComponent(Planet).vReference);
				vDestObj = null;
			}
			else if(vDestObj.GetComponent(Wormhole) != null)
			{
				vUn.WormholeArrival(vDestObj.GetComponent(Wormhole).vReference.vDestination);
				vDestObj = null;
			}
			else if(vDestObj.GetComponent(Sun) != null)
			{
				vUn.SunArrival();
				vDestObj = null;
			}
			else if(vDestObj.GetComponent(Yard) != null)
			{
				vUn.ShipyardArrival();
				vDestObj = null;
			}
			else if(vDestObj.GetComponent(Mechanic) != null)
			{
				vUn.MechArrival();
				vDestObj = null;
			}
			
			
		}
		}
	}
}
