var vReference : cWormhole;
var vShip : GameObject;
var vSS : Component;

vSS = vShip.GetComponent(Ship);

function OnMouseDown () 
{
	vSS.vDestObj = this.gameObject;
}