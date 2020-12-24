import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import _ from 'lodash'

const postsDirectory = path.join(process.cwd(), 'posts')

const sample_posts = ['Names of pilots rumored to be Patrick Sonderheimer with co-pilot Andreas Lubitz - No formal confirmation yet. #germanwings',
    'Germanwings passenger plane crashes in France: http://t.co/BSJhGgMChG',
    'French junior minister for Transport Alain Vidalies confirms they are no survivors in the #Germanwings #A320 crash. http://t.co/ZLIz1oY8wF',
    '@FRANCE24 reporter James André at French Civil Aviation Authority HQ: "#Germanwings plane did NOT report distress signal", no mayday.',
    'Accident aircraft looks to be Germanwings (Airline code 4U or GWI) flight 9525, Barcelona to Dusseldorf. #4U9525 http://t.co/TIZc1N1ZrK',
    '#Germanwings "sorry to confirm" 144 passengers &amp; 6 crew on board flight #4U9525 when it crashed in French Alps http://t.co/inQlKOqZup',
    '#Germanwings latest: http://t.co/8tZopIBYLh\n- #Airbus A320 crashes in French Alps\n- Barcelona-to-Dusseldorf flight\n- 142 passengers &amp; 6 crew',
    'GERMAN NEWS REPORT: Co-Pilot of Germanwings Airbus Was MUSLIM CONVERT …’Hero of Islamic State’? http://t.co/Pw2kxje31m via @gatewaypundit',
    '#4U9525: Robin names Andreas Lubitz as the copilot in the flight deck who crashed the aircraft.',
    'BREAKING: 148 passengers were on board #GermanWings Airbus A320 which has crashed in the southern French Alps http://t.co/VxxvrU9XmV',
    '1047 call: DGAC source says pilots called «urgence, urgence» (“emergency, emergency”), as opposed to a mayday call or 7700 squawk. #4U9525',
    'Report: Co-Pilot Locked Out Of Cockpit Before Fatal Plane Crash http://t.co/aXGQuacv2E #Germanwings http://t.co/T80L7BhXX6',
    "#4U9525 From FL380 to FL110 in 8 min? That's average rate of descent 3375 fpm! Than levelled off at FL068? What the hell was going on there?",
    'Flight #4U9525 initially climbed to 38,000 feet before before it started to descend and lost signal at 6,800 feet. http://t.co/MthXQ232Hn',
    'German Wings airline tweeting now about reports of plane crashing in French Alps with 148 on board: @germanwings http://t.co/SqUrmcvNKt',
    'Now hearing 148 passengers + crew on board the #A320 that has crashed in southern French Alps. #GermanWings flight. @BBCWorld',
    'Heart goes out to 148 passengers and crew of Germanwings Airbus A320 that has crashed in French Alps, Southern France http://t.co/K7fmJLRt4G',
    'GERMAN NEWS: Co-Pilot of Germanwings Airbus Was MUSLIM CONVERT. Can any muslim be trusted near an airplane now?',
    'JUST IN: Germanwings plane crashes in southern France, up to 150 feared dead http://t.co/GIZjXnqBU3',
    '#4U9525 took eight minutes to descend from 38,000 feet to impact, says Germanwings CEO Winkelmann.',
    '#Germanwings passenger plane crashes in French Alps with 148 onboard http://t.co/JCDZtv8We0 http://t.co/yE0hUNdiTr',
    'Germanwings Airbus A320 crashes in French Alps near Digne http://t.co/yNlWbNJmYI',
    'Latest on #Germanwings crash: Pilots signaled 911 before dropping out of midair; airline CEO calls this a "dark day." http://t.co/S5CZoWnn2T',
    'BREAKING: 148 feared dead in crashed #Germanwings flight http://t.co/bnEGQsxBFL',
    "RT @khjelmgaard: German media reporting #AndreasLubitz had a 'serious depressive episode' six years ago http://t.co/MUdmHPz2ro #Germanwings",
    'Coup in #Russia? Good article by @Forbes. http://t.co/aaNCpb0blW #RamzanKadyrov #Putin #putindead http://t.co/OfivdTlTbO',
    "Was Vladimir Putin netralized by an internal coup? Or maybe he's vacationing in Harper's closet:  http://t.co/tlr3cFLEyv #LookingForNarnia",
    'Unformed Russian Embassy staff in London have left for Russia  Rumours Putin HAS DIED! http://t.co/zSIV8w6FJ2 via @ShaunyNews #PutinDead?',
    'This appears to be the original source of the Putin/Kabayeva/Swiss clinic rumour http://t.co/bKfJTSGdca',
    "Putin reappears on television amid rumours his 'girlfriend' is about 2 give birth http://t.co/yJuN1F0QXE http://t.co/B7FXmo03jK @Scofield_Fx",
    'Putin reappears on TV amid claims he is unwell and under threat of coup http://t.co/YZln23EUx1 http://t.co/ZsAnBa5gz3',
    'Very good on #Putin coup by @CoalsonR: Three Scenarios For A Succession In Russia http://t.co/fotdqxDfEV via @RFERL http://t.co/RdA0giizeb',
    'Hoppla! @L0gg0l: Swiss Rumors: Putin absence due to girlfriend Alina giving birth in Ticino http://t.co/vZnGDH1Qys http://t.co/5TvXSdvd1H',
    'Coup? RT @jimgeraghty: Rumors all Russian military attaches at embassy in London have returned to Moscow: http://t.co/e8ZoFxtfHX',
    'Currently the #FoxNews website has zero, repeat, ZERO coverage of the #Ferguson protests, probably due to lack of cowboy hats.',
    'Possible "robbery" took place and BAM! Like magic it\'s as if another UNARMED black youth being murdered has been forgotten #smh #Ferguson',
    "#Ferguson police: Officer involved in fatal shooting of Michael Brown didn't know he was suspect in alleged robbery. http://t.co/L6bieyrz2a",
    'Witness: Police allegedly stopped Mike Brown after yelling at him to walk on sidewalk. #Ferguson http://t.co/XG00R6w0k6',
    'URGENT: Darren Wilson is the police officer who shot Mike Brown http://t.co/RZ1eYcKpiY #Ferguson http://t.co/D2HyKchWvq',
    'Store owner told @FOX2now Monday that there was a theft, but said it was not MichaelBrown; said it was someone else #Ferguson',
    'The day #Ferguson cops told a dirty, bloody lie (via @thedailybeast): http://t.co/gnAlHsS7tu http://t.co/vpqnDDVd2u',
    'Report: #Ferguson police beat up wrong suspect then charged him for getting blood on uniforms in 2009 http://t.co/Mck8FYYOpp',
    'The #Ferguson police chief just basically confirmed #MikeBrown was gunned to death for the crime of walking in the street?\n\nHorrific.',
    'Police in #Ferguson plan to release name of officer who shot unarmed teen Michael Brown: http://t.co/oqns3yVfTx http://t.co/9fb09WUtdN',
    'A woman in #Ferguson was shot in head last night and released this selfie. Conflicting reports of how it happened: http://t.co/25WX6EkquG',
    'In 2009, #Ferguson police beat a man and charged him for bleeding on them: http://t.co/KzF6Z1l0UK',
    'If there is surveillance of a robbery why release stills and not the video itself? #Ferguson',
    'Shoot unarmed kid.\nConceal evidence.\nImpose martial law.\nHarass reporters.\nSmear the victim.\nWorst. Police. Ever.\n#Ferguson #MikeBrown',
    'If you can justify shooting an unarmed teenager by saying "he might have been committing a misdemeanor" you are a fucking asshole. #Ferguson',
    'Reminder: Forget the robbery, forget the minor looting. NOTHING justifies militarized police pointing sniper rifles at journalists #Ferguson',
    "It appears that #Ferguson PD are trying to assassinate Mike Brown's character after literally assassinating Mike Brown.",
    '#Ferguson chief let most of day go by b4 disclosing (after repeated Qs) that cop who killed #MikeBrown knew nothing about robbery. DANGER',
    'If we shot everyone in the street for stealing, imagine the carnage on Wall St. #mikebrown #ferguson',
    'St. Louis Co Police tell me ofcr shot a man who pointed handgun at him at Chambers &amp; Sheffingdell at about 1 a.m. Man in critical. #ferguson',
    'New link: #Ferguson police release video they say shows a robbery involving #MichaelBrown: http://t.co/GMDuU33oed http://t.co/RaAWvjcWNu',
    'Question for #Ferguson police chief? If OFFICER DARREN WILSON was in pursuit of a robbery suspect, why tell kids to get out of the road? LIE',
    'Update: #Ferguson police release stills from convenience store footage showing robbery http://t.co/rl0RgIphUp http://t.co/PHUofG7mJR',
    'BREAKING NEWS: According to documents released to the press, #MikeBrown was connected to an earlier robbery #Ferguson http://t.co/LuCR9711S0',
    'The other day I asked a manager at the #Ferguson Market if police had requested surveillance video. She said no.',
    "Nearly 7k blacks were murdered last yr--almost all by other blacks. A tiny % were unarmed-killed-by-cop.\nWhere's Al, Jesse?\n#tcot #ferguson",
    'Photos of alleged robbery involving Michael Brown in #Ferguson (via police) http://t.co/gr83XTGO1t http://t.co/7V34OtGYcn',
    'Remarkably, despite the military-style police presence in #Ferguson, a known killer was able to skip town http://t.co/lDGjp6Wt1j',
    "Line of police cars with high beams on greets anyone trying to enter #Ferguson. It's shut down. No media allowed. http://t.co/bk6jFFM7jj",
    'That was very "SLICK" of the Police Chief to create a narrative that #MikeBrown was a "suspect" in a robbery!  #Ferguson',
    'to be clear: an unarmed teenager POSSIBLY stealing a box of cigars does not warrant being shot to death by the police. #Ferguson',
    '#MikeBrown wanted to walk down the street. And he is dead. And the #Ferguson PD is using his silence in death to make him a criminal.',
    'Darren Wilson is a six year veteran of the #Ferguson Police and had no disciplinary actions against him.',
    'Name of #Ferguson cop is expected to be released by 9 ET, police chief says: http://t.co/NhMsTgfzYi (J.B. Forbes, AP) http://t.co/7LU1iT1EKB',
    'Did anyone think of comparing the clothes that #MikeBrown was wearing when he was laying on the street to the security footage? #Ferguson',
    'Mike Brown was staying with his grandmother for the summer, who lived in the community. #Ferguson',
    '#Ferguson PD charged #HenryDavis w/ "destruction of property" for bleeding on their uniforms: http://t.co/qQWPClW3tG http://t.co/5U3nMoMiF2',
    'All weekend ppl will be talking about the "robbery" instead of the shooting bc #Ferguson PD didn\'t release any info about the shooting.',
    "Here's the police report. Somehow #Ferguson cops valued a box of Swishers at nearly $50. Time to stop smokin I guess http://t.co/8ZkvrHkApc",
    'Oh. So NOW the #Ferguson police chief says the cop didn\'t know about the robbery when he stopped #MikeBrown. The kid was "jaywalking"? BS!',
    "What's so frustrating is that now we are talking about a robbery and not the killing of an unarmed kid. #ferguson",
    "The press conf makes #Ferguson PD look like they've gone from stonewalling to counter punching. We give up a name, we drag his thru the mud.",
    "How many white celebrities have been CAUGHT shoplifting and end up dead in streets? I'll wait. #Ferguson",
    'Hobby Lobby asks #Ferguson PD for clarification: "We thought chopping off someone\'s hand was the maximum penalty for shoplifting"',
    'In what world do you let a cop who killed someone leave town? http://t.co/T0A3rn2PeL #Ferguson',
    'Police reports released this morning indicate Mike Brown was a suspect in a "strong-armed" robbery in #Ferguson',
    'AC Milan midfielder Michael Essien has been diagnosed with Ebola. Get well soon Michael. [Daily Times] http://t.co/r6y8d9HMAw',
    'Unconfirmed reports claim that Michael Essien has contracted Ebola. http://t.co/VASQrZdLhH',
    'CTV News confirms that Canadian authorities have provided US authorities with the name Michael Zehaf-Bibeau in connection to Ottawa shooting',
    'This is the soldier who died today at the #Ottawa War Memorial. His name is Cpl. Nathan Cirillo. #RIP #OttawaStrong http://t.co/vhPBPq5yYk',
    "Witness tells #CBCNews suspected shooter of uniformed soldier at #Ottawa's War Memorial was carrying rifle.",
    'Ottawa police issued a statement. Three separate shooting incidents. Once inside parliament. One at the war memorial. One at Rideau Centre',
    '#ISIS Media account posts picture claiming to be Michael Zehaf-Bibeau, dead #OttawaShooting suspect. #Canada http://t.co/kWam0E4tyX',
    'Reports now that 2nd shooter has been shot in downtown Ottawa #ottnews',
    'Police have clarified that there were two shootings in Ottawa today, not three: at the War Memorial and Parliament Hill.',
    'BREAKING - Shooting on Parliament Hill. RCMP have weapons drawn #cdnpoli http://t.co/38qOgXcuet',
    'Statement from Ottawa Hospital: received 3 patients. 2 in stable condition. http://t.co/zu5hYPrGDL',
    "This afternoon we've lowered our flags to half mast in honour of the Canadian Reservist who lost his life in Ottawa. http://t.co/3oTF5sd2Lf",
    'BREAKING: Michael Zehaf-Bebeau had been designated "high-risk traveller" by CDN govt, which confiscated his passport http://t.co/dPeMQ78jzm',
    '#RIPNathanCirillo\n\nRT @globeandmail: Soldier killed at war memorial identified as Cpl. Nathan Cirillo #OttawaShooting http://t.co/uZZqmlctss',
    '#Ottawa police confirm to #CBCNews they are still seeking 1 or more suspects after shootings on Parliament Hill, War Memorial, nearby mall.',
    'BREAKING: A source confirms to CP24 that the deceased soldier in Ottawa is Cpl. Nathan Cirillo. Cirillo was a member of the Hamilton Argylls',
    "Canada's parliament building locked down after shooting; at least one guard injured: http://t.co/Nrsnlg2s04 Photo: AP http://t.co/qPXF4IF6aM",
    "#NHL cancels tonight's game between #Ottawa and #Toronto due to today's shootings. Senators were to host Maple Leafs.",
    '***EXCLUSIVE*** Michael Zahaf-Bibeau caught on a #DASHCAM model sold at http://t.co/62s1bT3ecH #OttawaShooting http://t.co/LpnqAKsHZw',
    'Ottawa Police Service: There were "numerous gunmen" at the Canada War Memorial shooting. One person was shot. http://t.co/zNhxK6wBoy',
    'One person shot outside Centre Block, a second wounded inside the building in Parliament Hill shooting http://t.co/zng0g0aelU',
    'Snipers set up on National Art Gallery as we remain barricaded in Centre Block on Parliament Hill #cdnpoli. http://t.co/lWKaxLI9jO',
    'Hero. @affanchowdhry: Kevin Vickers, head of security in parliament, being credited for taking down shooter #Ottawa http://t.co/rVYetE0KYq"',
    'Only photo I will tweet. CPR being performed on the soldier now. I heard four shots. #ottawa http://t.co/cqdw1yx8AI',
    '#BREAKING news: Shots fired at Parliament Hill. Follow developing story: http://t.co/gPg9nujRvk http://t.co/H0Hw24j5ma',
    'FBI assisting in the case of the Ottawa shooting, sources have confirmed to CTV News',
    'Senior U.S. official: Canadian government has informed U.S. that one shooter is dead in Ottawa. Live blog: http://t.co/q98AMohu7T',
    "The Canadian soldier killed in today's Ottawa shooting is Cpl. Nathan Cirillo, a family source told CNN. Live blog: http://t.co/D58rrFrbwq",
    "Canada's Parliament Hill is on lockdown as police hunt shooting suspect; at least 1 injured - @CBCNews, @TorontoStar http://t.co/aF9HyT9BgX",
    'Canadian authorities have given name of suspect in Ottawa attacks to U.S. feds; ask for FBI assistance: Sr U.S. law enforcement official',
    "These are not timid colours; soldiers back guarding Tomb of Unknown Soldier after today's shooting #StandforCanada http://t.co/7KoW2xATKG",
    "Watch video showing gunfire inside Canada's parliament in Ottawa http://t.co/CJpXNAk8nS http://t.co/hxwr2NEr2K",
    'The University of Ottawa, just a five minute walk from the Hill, is now on lockdown.',
    'Soldier killed in Canada shooting was a young reservist with a six-year-old son http://t.co/83PReIl9XV http://t.co/LVprXOCCF7',
    "Shooter still on loose after uniformed soldier shot at #Ottawa's War Memorial, across road from Parliament. MP's being taken out of offices.",
    'Recap: Gunman shot dead inside Parliament buildings; police believe there may be others on loose. Cdn soldier shot earlier at War Memorial.',
    'BREAKING UPDATE: Canadian soldier injured at Parliament Hill shooting dies http://t.co/Zp9AKplH9p  #Ottawa',
    'We are in full lock down until further notice from Ottawa Police.',
    "The gunman in Ottawa has been shot and killed. I'm at a loss for words this morning. That isn't my Canada.",
    "The soldier shot dead in Wednesday's Ottawa attacks has been named as Cpl. Nathan Cirillo of #HamOnt #ottawashooting http://t.co/MxLMptnlWw",
    'More shots fired just off Parliament Hill. Police telling everyone to take cover.',
    "Here's that dramatic video via @josh_wingrove of shots fired inside parliament building: https://t.co/1waid25vOE #Ottawa #shooting",
    'Police now say there were two shooting incidents in Ottawa: one at the war memorial, the other on Parliament Hill. http://t.co/q98AMohu7T',
    'BREAKING NEWS: At least 3 shots fired at Ottawa War Memorial. One soldier confirmed shot - http://t.co/wiPaKVPSDb http://t.co/vwxeqj8xe9',
    'MPs credit sergeant-at-arms for saving lives in Parliament Hill shootings\nhttp://t.co/3NfiSwTwPt http://t.co/V5tIbCQgj9',
    'Shooting in Canadian parliament comes day after ISIS-inspired radical drove in2 Canadian soldier. Also reports of shooting at War memorial/1',
    'Attack on Parliament: Soldier shot; gunman on the loose. Follow our developing story: http://t.co/bo99C9HqJE http://t.co/2FXEYtTl8w',
    'CONFIRMED | 1 shooter shot dead at Parliament Hill, but there is more than 1 suspect. #cbcOTT #OTTnews',
    '#RCMP to hold news conference on #Ottawa shootings at 2 pm ET, 11 am PT. Watch live coverage @ http://t.co/kngapKTSCe',
    'Very reliable source on Parliament Hill tells me the assailant has been killed. #cdnpoli #ottnews',
    "Shots fired on parliament hill after a man walked up with a gun. I'm locked in a security office on parliament hill",
    'BREAKING NEWS: Soldier shot at National War Memorial in Ottawa http://t.co/pp6hcfWcRw',
    'MORE: Police believe three gunmen were involved in shootings in Ottawa this morning and are looking for two shooters. http://t.co/IHV4galEtC',
    'Ottawa Police report a third shooting at Rideau Centre, no reports of injuries.',
    'Our thoughts and prayers go out to Nathan Cirillo who died today in Ottawa while protecting his country at age 24 http://t.co/PfwasSALPX',
    '#BREAKING Rick Hughes at CBC Hamilton: \n\nThe soldier who was shot in Ottawa Wednesday morning is a reservist serving in Hamilton',
    'BREAKING: At least 20 shots have been fired in the Canadian parliament in Ottawa, according to witnesses.',
    'Soldier shot at National War Memorial in Ottawa http://t.co/Sgmcq7gUzf #cdnpoli #hw',
    'Police say shots fired at 3 #Ottawa sites -  National War Memorial, Parliament Hill, and now Rideau shopping centre http://t.co/rOnqpUbuqc',
    'BREAKING NEWS: New York Times is reporting the Canadian soldier who was shot has died from their injuries. Heartbreaking. #cdnpoli #ableg',
    '#SydneySiege: Latest video of hostages escaping.\nhttps://t.co/eFfgSbt2hO',
    'Flag in window of Sydney Lindt cafe not an ISIS flag. Reads: ‘There is no God but Allah and Muhammad is the messenger of God’ (@liztilley84)',
    'Several more hostages flee from cafe under siege in Sydney, local media say http://t.co/YjuafDPNEY',
    '#BREAKING Hostages held inside Sydney cafe, Islamic flag held up',
    "Prime Minister Tony Abbott's statement on the #SydneySiege. Updates: http://t.co/EgWHAnjO35 http://t.co/AGhyN5Qkei",
    'Statement from Prime Minister Tony Abbott on Sydney hostage situation. http://t.co/MHkNRZFQWB',
    'POLICE MOVE IN: Police confirm live ammunition used in Martin Place #sydneysiege',
    '#BREAKING: At least two people have died following the #SydneySiege. 5 people are being treated by paramedics.',
    "TV channels have chosen not to show videos of hostages relaying #sydneysiege gunman's demands. http://t.co/5jtd36wFOU http://t.co/oKJPRv40l3",
    'BREAKING NEWS: Gunmen take hostages at Sydney cafe, wave Islamic flag http://t.co/zmSo3ARDVs http://t.co/HFW40OyVUz',
    'According to Seven, this is a picture of the gunman http://t.co/3Zor3gSOSO',
    'Central Sydney shut down by police amid ongoing hostage situation: http://t.co/TvAlMmqFxP',
    'Five hostages have escaped the besieged Lindt Cafe in #Sydney | Our latest update: http://t.co/XJVICQdu0y http://t.co/aNGBZsCmdQ',
    'FIRST PHOTOS: Hostage pressed against a window. #SydneySiege http://t.co/MOy8zCHp5a',
    'BREAKING: Police enter #Lindt cafe, hostages flee http://t.co/iuaLgRi7jj  #sydneysiege http://t.co/hXZ8EffN3f',
    'Five Hostages Escape Sydney Cafe Siege — Live Updates From @BuzzFeedOz http://t.co/aFHirytbFH http://t.co/BiLJuBBc5R',
    'Paramedics are currently carrying out a number of hostages in #MartinPl. #SydneySiege #9News',
    'BREAKING UPDATE: Gunman says four devices are located around Sydney. Security response underway. Police calling for calm. 9News',
    'We understand there are two gunmen and up to a dozen hostages inside the cafe under siege at Sydney.. ISIS flags remain on display #7News',
    'A man believed to be the gunman filmed wearing a black headband inside the cafe http://t.co/7ixIlhiVXZ http://t.co/dOW5zfm1uU',
    'Approximately 50 hostages may be held captive at #Lindt café – local reports http://t.co/1ZlzKDjvSf #sydneysiege http://t.co/NvLr5kyQG8',
    'We can see people coming out a firedoor near the Lindt cafe to waiting police. 2-3 people. Hard to see. #sydneysiege',
    'SYDNEY HOSTAGE-TAKER\n- Man Monis, 49\n- Originally from Iran\n- Self-styled sheikh\n- Accused of sexually assaulting 7 women\nDEVELOPING..',
    'UPDATE: Total of 5 people have been able to get out of Sydney cafe during hostage situation: http://t.co/mp18E4DdjW http://t.co/n5vhI5DsZg',
    'BREAKING ALERT: Preliminary reports indicate perpetrators appear to be members of #ISIS. #SydneySiege',
    'Sydney siege: police enter cafe as hostages flee the scene, gunfire heard, reports of an injured person – live http://t.co/c4xbud6a3m',
    'UPDATE: 13 people being held hostage in #Sydney shop, Opera House evacuated after suspicious package found: reports http://t.co/n4D3yGjso9',
    'UPDATE: 13 hostages inside Sydney coffee shop near Sydney Opera House; Abbott will deliver a statement shortly. #ISISAttacks #sydneyseige',
    'Sydney Opera House evacuated, concourse deserted http://t.co/NMbuLCimKV #SydneySiege (via @cberkman) http://t.co/QYlOU0REVw',
    'Full statement from PM Abbott on #Sydneysiege #MartinPlace #Lindt. http://t.co/7ilKZGNBDz',
    '#sydneysiege is over. 2 confirmed dead, #PrayForSydney #PrayForSydneyHostages #Sydney #hostages',
    'MORE: Police confirm 3 hostages escape Sydney cafe, unknown number remain inside http://t.co/pcAt91LIdS #Sydneysiege',
    'Escaped #SydneySiege hostage, Elly Chen, a top student and skilled sportswoman http://t.co/cOyz8N2IMb http://t.co/48YdSm7lJB',
    'Uber intros surge pricing in downtown Sydney during hostage siege http://t.co/XWGe9MpUzU http://t.co/cwhIiozFNr',
    'Uber Sydney trips from CBD will be free for riders. Higher rates are still in place to encourage drivers to get into the CBD.',
    'Reports on @channeltennews #sydneysiege gunman wants #ISIL flag delivered to cafe and he also wants to speak to PM or people will be killed.',
    'Police: Negotiators are now in contact with armed hostage-taker in Sydney situation; motive remains unknown - http://t.co/mp18E4DdjW',
    "#BREAKING: Hostages are being held and a siege is taking place at Sydney's Lindt Chocolat Cafe in Martin Place.",
    'Gunman\'s headband reads, "We are your soldiers O Muhammad".\n#MartinPlace #SydneySiege http://t.co/ggUgP4kV9c',
    'Hostages in Sydney cafe made to hold up Islamic flags http://t.co/I1PsUPekkB',
    'SYDNEY SIEGE: Gunman forces hostages to hold up ISIS flag in window http://t.co/9K3XXEiSFa http://t.co/cATxCjYXpy',
    'Police confirm that #sydneysiege is finally over. Two people reportedly injured after suffering gunshot wounds http://t.co/nsprnSYTDT',
    '#SYDNEYSIEGE: Hostage-takers ‘have suicide belts, demand radio convo with #Abbott’ – report http://t.co/1ZlzKDjvSf http://t.co/7Jej7i4SlO',
    'This is shot that captures the #sydneysiege: sheer terror/relief of escaped hostages, incredible work of @nswpolice http://t.co/iCffJZ9NuZ',
    '#BREAKING: Police have confirmed that the #SydneySiege is over. #9News',
    'Hostage situation erupts in Sydney cafe, Australian prime minister says it may be "politically motivated" http://t.co/439C1MkRWf',
    "DEVELOPING: Gunman Takes Hostages In Sydney Cafe, 'ISIS' Flags Being Held Against Window - http://t.co/gDkig15YuN http://t.co/suVfoMmBwM",
    'Geoblock lifted on #ABCNews24. Streaming coverage of the Martin Place siege in Sydney here  http://t.co/HvQuvP4SIb.',
    'Police seem relaxed, suggesting all hostages are out and gunman no longer a threat http://t.co/xheuclMCmj #sydneysiege',
    'UPDATE: Hostages fleeing #Sydney cafe held by Iranian gunman as explosions, gunshots are heard: http://t.co/WrPVZSJHlX',
    'DETAILS: The hostage site is Lindt Chocolat Cafe near #Sydney Harbor http://t.co/1ZlzKDjvSf http://t.co/7u8EFUwCey',
    'Live Updates: Siege in Sydney Cafe http://t.co/aNIHU5DlLj',
    'Uber says it has hiked prices in Sydney to "encourage more drivers to come online &amp; pick up passengers." http://t.co/MCJ0rMSXPc #SydneySiege',
    'NSW Police confirm 5 hostages have emerged from #sydneysiege and they are negotiating: "It might take a bit of time" http://t.co/le9r9REzdR',
    'Haron Monis,Hostage-taker in #Sydney: Fled #Iran 96,suspect in ex-wife killing,46 sex assaults http://t.co/3caiB9OnFg http://t.co/vfOXjtrGgZ',
    'Hostage taker in Sydney cafe demands ISIS flag and call with Australian PM, Sky News reports. http://t.co/a2vgrn30Xh #sydneysiege',
    'BREAKING: Three hostages appear to have escaped the Sydney cafe where a siege remains ongoing. http://t.co/akfqcnbofX #sydneyseige',
    'Ray Hadley says he spoke with hostage, and could hear the gunman in the background barking orders and demanding to go live on air',
    'Black Islamic flag being held up in window of #lindt chocolate store in Martin Place, Sydney - hostages inside. http://t.co/fAV7PEuY6P',
    "Sydney airspace wasn't closed. A second terror suspect wasn't arrested. Myths around #sydneysiege debunked. http://t.co/yTLKLUKnFd",
    '#BREAKING Reports two customers and an employee have escaped the #SydneySiege http://t.co/fSLeobzxHh',
    "BREAKING: Live coverage of hostage situation unfolding in Sydney's Martin Place http://t.co/TTG8ye71Zg http://t.co/iTwradHTb3",
    'The Sydney cafe siege may be part of a larger plot. @Y7News #MartinPlaceSiege http://t.co/f2aTNEpjmh http://t.co/DE4IBxv73K',
    "#pmharper tweets 'Canada's thoughts and prayers are with our Australian friends.' 13-40 hostages held in cafe in #Sydney. #SydneySiege",
    'ISIS -holding a Cafe hostage in Sydney- forcing Hostages to press ISIS flags against the Windows #DramaAlert HOT! http://t.co/XwXLvvWc76',
    'Local media: 3 people appear to escape from Martin Place, Sydney, café, amid hostage situation - @ABCNews http://t.co/N5mmnilz4Z',
    "Police stand guard as hostages are held in a cafe in Sydney. Follow AFP's LIVE REPORT: http://t.co/yKWnSmShSY http://t.co/wyjunPbDfo",
    'US evacuated Consulate in Sydney after #sydneysiege. Emergency warning to U.S. citizens urging them to "maintain high level of vigilance".',
    'BREAKING  @SkyBusiness: freed hostage borne high from #sydneysiege w/c.4 paramedic teams on the scene http://t.co/DKBQI5tx4B ( carsonscottLI',
    'Several people being held hostage at a Sydney cafe. Australian tv showing people with  hands up against a window: http://t.co/AD2PR4OPFq',
    'Up to 20 held hostage in Sydney Lindt Cafe siege http://t.co/4KisV2PKI5 http://t.co/qIaa63SCQk',
    'Breaking: Two hostage situations in France are linked, Paris prosecutor says',
    '4 #CharlieHebdo cartoonists killed:\n\n- Charb\n- Cabu\n- Tignous\n- Georges Wolinski\n\n#JeSuisCharlie http://t.co/QbaEYog2S2',
    'Police have surrounded this building where the suspected #CharlieHebdo attackers are holed-up http://t.co/B0TRvE2iYs http://t.co/becxNG0Kxi',
    'MORE: Official: French terror suspects want to be martyrs; are holed up with hostage north of Paris: http://t.co/sJXudtGUOV',
    "#BREAKING Charlie Hebdo gunmen's hostage freed and safe after police assault",
    'BREAKING: 10 reportedly shot dead at Paris HQ of French weekly Charlie Hebdo http://t.co/5F1DOwzoCQ',
    'Hostage-taker in supermarket siege killed, reports say. #ParisAttacks http://t.co/0jxoozr8mN http://t.co/sY4M9Vox3L',
    'Suspects in #CharlieHebdo attack spoke to police by phone and said they wanted to die as martyrs, says French MP. http://t.co/bGkMtT3lUF',
    'Several hostages freed at Jewish supermarket in Paris. Photo Thomas Samson #AFP http://t.co/C9ltgMT0Wl',
    'BREAKING: At least 2 killed in #Paris hostage situation via @AFP http://t.co/C2WrcWLUZh',
    'I am still confused as to why these "highly trained" individuals left their ID in the getaway car. #CharlieHebdo',
    'Witnesses say the Charlie Hebdo gunmen identified themselves as members of al-Qaida: http://t.co/WSEe7PGIdY http://t.co/fTzk4xzZIr',
    '#BREAKING : Both Charlie Hebdo suspects killed as police storm building (police sources) http://t.co/OYSXRQ9xuv http://t.co/8ICThapo7z',
    'Rural region of northern France searched in hunt for #CharlieHebdo gunmen - latest updates http://t.co/7iVIN3nqCv http://t.co/YrdUIOjrZF',
    'This widely shared cartoon about the #CharlieHebdo attack is actually by @LucilleClerc and not #Banksy http://t.co/HxKI8pefcU',
    'On Israeli TV, an Israeli woman speaks of her nephew,a mother with 6 month old baby, held hostage in the supermarket in Paris. #JeSuisJuif',
    "#Banksy's take on #CharlieHebdo. #JeSuisCharlie #NousSommesCharlie http://t.co/f6Y07d9fJ1",
    'BREAKING: Shots fired, hostages taken in manhunt for #CharlieHebdo attackers, police say http://t.co/omBy6Wsgb7 http://t.co/ZbszAHyIzJ',
    "Most compelling image I've seen to come out of horrifying events in Paris, courtesy of Banksy. #JeSuisCharlie http://t.co/EKBfbRR3HT",
    'Two shot in Paris, including traffic cop, as manhunt continues for #CharlieHebdo suspects http://t.co/L7wpNhAYZn http://t.co/oQi2UinDH1',
    '#BREAKING : 1 dead, several injured in shootout North-East of Paris (French radio @RTLFrance ) http://t.co/LdSF5QeCiv #CharlieHebdo',
    'Car chase under way in Paris as gunfight breaks out. Reports of hostages. Latest from Paris: http://t.co/2J4WQdJnTp http://t.co/Lpd4hbiXai',
    'DEVELOPING: Police pursuing #CharlieHebdo shooting suspects, helicopters deployed - LIVE FEED: http://t.co/GRxHibEau2 http://t.co/pDlmmCax1B',
    '11 confirmed dead, Francois Hollande to visit scene of attack - latest from Paris: http://t.co/7N7uvClhWY http://t.co/EgmxARAdEP',
    'An 11-month old baby is among the hostages at the Kosher supermarket in Paris. Unbearably sad.\nhttp://t.co/yXXlHehst9',
    'Several hostages freed at Jewish supermarket in Paris. Photo Thomas Samson #AFP http://t.co/9AwTF3sRYK',
    "At least 12 killed in today's attack on satirical magazine #CharlieHebdo in Paris, official says. http://t.co/zUfxcG3Rfs",
    'French police: Said Kouachi and Cherif Kouachi wanted in Paris terror attack: http://t.co/0WbSnKIrgE http://t.co/wjmMg9LveB',
    'Reports of shooting at  Dammartin en Goele on route N2 north east of Paris - French media says car chase under way',
    '“@LePoint: #CharlieHebdo : “The cartoonists Charb &amp; cabu are dead.” http://t.co/7USD83cQd2 http://t.co/WGHbLiLFoX”',
    '#UPDATE Three men including two brothers identified in France newspaper attack: source http://t.co/5NoNuqJSu1 #JeSuisCharlie #CharlieHebdo',
    'Paris Murder Suspects Cornered with Hostage\nhttp://t.co/yzHJi4Hw54',
    'Charlie Hebdo shooting latest: 12 dead and gunmen still at large http://t.co/6jRqXgPogM http://t.co/hO7lvftma5',
    'Hostage-taker at Paris store demands release of #KouachiBrothers, police union spokesman says. http://t.co/cTAJWVBmAO http://t.co/rYEGVIPAlU',
    'UPDATE: 12 now confirmed dead in #CharlieHebdo attack in Paris, @AP is reporting. Story: http://t.co/Jfqmha1GdV (AP) http://t.co/vDCIFHIa9U',
    'Map shows industrial estate where 2 #CharlieHebdo suspects are holed up, surrounded by police http://t.co/hi9g8dxpiR http://t.co/Vw2L6SQcMH',
    'The last person killed in Charlie Hebdo attacks was Muslim police officer http://t.co/qQXNLUDYPG http://t.co/PJH6tlyrpC',
    'Breaking: Gunman at Paris store threatens to kill hostages if #CharlieHebdo suspects are harmed. http://t.co/YPIlwckuuw',
    'Police taking people out of #Paris grocery where hostages were being held. http://t.co/7Bxdhozq4H',
    'Update - AFP says gunman who has taken a hostage at kosher supermarket in Paris believed to be suspect in killing of policewoman on Thursday',
    'Police convoy and helicopters are rushing to scene to detain Charlie Hebdo massacre suspects http://t.co/XdUgohNDhv http://t.co/MSROYqs14o',
    "#CharlieHebdo shooting suspects tell police they 'prepared to die as martyrs' - French media http://t.co/G6eunBDIrj http://t.co/jOnfaapehF",
    'RT @JeffersonObama: R.I.P. Ahmed Merabet, a French #Muslim Cop, first victim of #CharlieHebdo attack http://t.co/TMQsJCCKB5',
    'Paris Manhunt: 3 #CharlieHebdo attackers with AK-47 rifles &amp; reportedly rocket-propelled grenade still at large http://t.co/3Jsosc7yl3',
    'MORE: France: Shooting, hostage-taking at kosher market in Paris; several reported wounded: http://t.co/5300zReVuq',
    "French police publishes photos of suspect in yesterday's Montrouge shooting. Maybe the same persons in Kosher market http://t.co/j5nQIl4Ytu",
    'AFP: suspected #CharlieHebdo gunmen have been killed',
    'Banksy says #JeSuisCharlie in a beautiful way (vi @lukeeve) http://t.co/GKFP5xVAoc',
    'UPDATE: Gunman in kosher grocery store is demanding the release of the suspects in #CharlieHebdo shooting - Reports http://t.co/1Y123fisl2',
    'Reports: #CharlieHebdo suspects killed http://t.co/rsl4203bcQ',
    '#BREAKING - At least five hostages in Paris kosher supermarket: (AFP) https://t.co/4yt6nafpIg #Vincennes http://t.co/Vnyhqye2ps',
    '#BREAKING Gunman in policewoman killing suspected in new Paris hostage-taking: source',
    'BREAKING: French police tell AP suspects in #CharlieHebdo attack have taken a hostage northeast of Paris.',
    'Eleven dead in shooting at Paris offices of satirical magazine Charlie Hebdo – live updates http://t.co/gOtSqbwROc',
    "BREAKING: At least 10 killed in shooting at French satirical newspaper Charlie Hebdo, Paris prosecutor's office says. http://t.co/mnAeA7j7fY",
    '#CharlieHebdo killers shot dead by police',
    '#CHARLIEHEBDO SHOOTING: Gunmen shouted \'we have avenged the prophet" during attack - reports http://t.co/3Jsosc7yl3 http://t.co/nAerF1Ep7A',
    'BREAKING: One person seriously wounded, six taken hostage in incident at kosher supermarket in Paris: police source',
    'BREAKING Charlie Hebdo latest: 11 dead 10 wounded (five critical) two gunmen unaccounted for http://t.co/kjW3uwCV0f http://t.co/9K8ICs97Be',
    'MORE: Official: gunman holding at least five hostages in Paris market has threatened to kill them if police approach: http://t.co/KId3U6zhCK',
    "UPDATE: #CharlieHebdo's editor-in-chief was killed in attack - Magazine's lawyer http://t.co/kLKwMSlo7g",
    'URGENT: 3 gunmen involved in deadly attack on #CharlieHebdo - French interior minister http://t.co/3Jsosc7yl3 #Paris http://t.co/9fqT2P6yhV',
    'The #CharlieHebdo attack suspects have reportedly fired shots while robbing a petrol station http://t.co/joSfDCybpI http://t.co/7xQIrb4vbU',
    'Paris says highest alert level extended north to region where attack suspects spotted - @AFP, @MelissaBellF24 https://t.co/pj8kecnVt7',
    'At least 11 dead in shooting at HQ of #CharlieHebdo in #Paris (police source)\nhttps://t.co/e4dBcNVbvD',
    'At least 12 dead in the Paris shooting. Updated story and background info: http://t.co/QlPpQ2ss8j #CharlieHebdo http://t.co/DwMlafsD6K',
    "Clarissa, 27 years old, police trainee of Montrouge Police in #France. Victim of this morning's attack. via @_batou_ http://t.co/kk0w0D6NNv",
    '#CharlieHebdo suspects "prepared to die as martyrs", they tell police after making contact - French media http://t.co/Qgmn70TXSU',
    'Update - AFP: an unnamed police source says the killing of the policewoman in #Paris on Thursday is linked to the #CharlieHebdo attack',
    '#CharlieHebdo -  11 dead including 2 police in Paris shooting. Photo @MartinBureau1 #AFP http://t.co/aksGP63MB7',
    "Looks like every Charlie Hebdo cartoonist has been killed: 1. Charb - was on Al-Qaeda's hit list; 2. Cabu, 3. Wolinski, 4. Tignous",
    'AFP reports there are 2 dead, and 5 hostages being held in the Kosher store in Eastern Paris; separate incident to charlie hebdo shooters.',
    'France: 10 people dead after shooting at HQ of satirical weekly newspaper #CharlieHebdo, according to witnesses http://t.co/FkYxGmuS58',
    'Stills from eyewitness video show two #CharlieHebdo attackers wearing hoods &amp; black clothing shoot a wounded man http://t.co/IX8Wys3p5M',
    'Is #Prince in #Toronto? Rumours fly of surprise show... @masseyhall http://t.co/ySchlys6DA',
    "PRINCE IN TORONTO TONIGHT:\n@3RDEYEGIRL tweeted this morning to say OTNOROT CALLING, which is Toronto backwards, obviously.... Seems it's on!",
    'Secret Prince show rumored for Toronto tonight http://t.co/GE2DFcFKLJ',
    'In response to inquiries, we can confirm that Prince will not be performing at @masseyhall tonight.',
    'Prince fans lining up at Massey Hall. Wristbands for surprise show reportedly on sale at 6pm. #Toronto http://t.co/uZBPGlfyce',
    'Clearly prince is having a show in #toronto @TorontoComms #tdot #gta #prince #concert http://t.co/e7oktlGd1v',
    'Prince not playing Massey Hall tonight, promoter says http://t.co/clVHvM07kx http://t.co/IADirsFOOC',
    'Is it true? Prince rumoured to be performing surprise show in Toronto http://t.co/EZiiLVkXyb',
    'Prince is playing a secret show in Toronto tonight.  I will also be playing a secret show tonight involving pizza &amp; netflix bingeing.',
    'OMG. #Prince rumoured to be performing in Toronto today. Exciting!',
    'Prince rumoured to be performing in surprise show in Toronto http://t.co/PEbtcmybqc http://t.co/HOoFI33eV2',
    'People talking about stupid shit like government corruption and harassment when Prince is in Toronto smh']

export function getSamplePosts(){
    let posts = sample_posts.map((p, i)=>({'content':p, 'source': 'twitter', 'id':i}));
    return _.shuffle(posts);
}

export function getPost(id){
    return {id:id, source:'twitter', content:sample_posts[parseInt(id)]}
}

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            ...matterResult.data
        }
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory)

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
        id,
        ...matterResult.data
    }
}
