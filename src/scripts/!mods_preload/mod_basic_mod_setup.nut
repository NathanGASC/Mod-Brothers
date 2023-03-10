::mods_registerMod("mod_waaarg", 1, "WAAARG");
::mods_queue(null, null, function()
{
  ::mods_hookNewObject("items/weapons/longsword", function(o) {
    o.m.Description = "WAAARG";
  });
});
