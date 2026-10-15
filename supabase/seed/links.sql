-- Made by tools/make-seed.mjs from data/links.js. The starting links; safe to run only once.
begin;

insert into public.links_page (slug, name, title, owner_id, is_admin, sort) values ('home', 'Home', 'Bancos Kids'' Links', null, false, 0);
insert into public.links_page (slug, name, title, owner_id, is_admin, sort) values ('luke', 'Luke', 'Luke''s Links', (select id from auth.users where raw_user_meta_data ->> 'display_name' = 'Luke'), false, 1);
insert into public.links_page (slug, name, title, owner_id, is_admin, sort) values ('nathan', 'Nathan', 'Nathan''s Links', (select id from auth.users where raw_user_meta_data ->> 'display_name' = 'Nathan'), false, 2);
insert into public.links_page (slug, name, title, owner_id, is_admin, sort) values ('daniel', 'Daniel', 'Daniel''s Links', (select id from auth.users where raw_user_meta_data ->> 'display_name' = 'Daniel'), false, 3);
insert into public.links_page (slug, name, title, owner_id, is_admin, sort) values ('claudiu', 'Claudiu', 'Claudiu''s Links', (select id from auth.users where raw_user_meta_data ->> 'display_name' = 'Claudiu'), true, 4);

-- luke-top
insert into public.links_section (id, title, collapsed) values ('741d3fac-a310-400e-8eb8-4ce64549b5c7', null, false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('741d3fac-a310-400e-8eb8-4ce64549b5c7', 'Luke''s IXL Assignment', 'https://www.ixl.com/social-studies/grade-4/the-civil-war-war-tactics-and-the-home-front', 'homeschooling/the-civil-war-war-tactics-and-the-home-front.png', 'br-10', 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('741d3fac-a310-400e-8eb8-4ce64549b5c7', 'Luke Daily Bancos', 'https://daily-bancos.vercel.app/write/luke-bfbcdfbccbb84227', 'LukeTypingBulbasaur.png', 'br-20', 1);
-- nathan-top
insert into public.links_section (id, title, collapsed) values ('27c8103f-f3f8-47f5-a771-40380f1efb9a', null, false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('27c8103f-f3f8-47f5-a771-40380f1efb9a', 'Nathan''s IXL Assignment', 'https://www.ixl.com/social-studies/grade-1/paul-revere', 'homeschooling/paul-revere.png', 'br-10', 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('27c8103f-f3f8-47f5-a771-40380f1efb9a', 'Nathan Daily Bancos', 'https://daily-bancos.vercel.app/write/nathan-c0a33f68a26041a5', 'NathanTypingMudkip.png', 'br-20', 1);
-- science
insert into public.links_section (id, title, collapsed) values ('ae6d90fd-6816-4cd3-9008-b1fe00683647', null, false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ae6d90fd-6816-4cd3-9008-b1fe00683647', 'Third Grade Science', 'https://www.ixl.com/science/grade-3', 'homeschooling/third-grade-science.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ae6d90fd-6816-4cd3-9008-b1fe00683647', 'Fourth Grade Science', 'https://www.ixl.com/science/grade-4', 'homeschooling/fourth-grade-science.png', null, 1);
-- family-games
insert into public.links_section (id, title, collapsed) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', null, false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 'Super Pokemon World', 'https://super-pokemon-world.netlify.app/', 'SuperPokemonWorld.png', 'br-20', 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 'Pokemon TCG Retro', 'https://pokemon-tcg-retro.netlify.app/', 'PokemonTCGRetro.webp', 'br-20', 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 'Pokemon Uno', 'https://pokemon-uno.netlify.app/', 'PokemonUno.webp', 'br-20', 2);
insert into public.links_link (section_id, title, url, image, style, sort) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 'Frozen Assets', 'https://celestebancos.github.io/frozen-assets/', 'FrozenAssets.png', null, 3);
insert into public.links_link (section_id, title, url, image, style, sort) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 'Nathan''s Tixy', 'https://celestebancos.github.io/tixy-quest/', 'nathan_tixy.png', 'br-20', 4);
insert into public.links_link (section_id, title, url, image, style, sort) values ('6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 'Lode Runner Web Game', 'https://loderunnerwebgame.netlify.app/', 'LodeRunner.png', null, 5);
-- tools
insert into public.links_section (id, title, collapsed) values ('b3be1893-6514-4c35-b230-a25de8548762', 'Tools', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('b3be1893-6514-4c35-b230-a25de8548762', 'Chrome Music Lab', 'https://musiclab.chromeexperiments.com/', 'ChromeMusicLab.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('b3be1893-6514-4c35-b230-a25de8548762', 'Google Drive', 'https://drive.google.com/', 'homeschooling/google_drive.png', null, 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('b3be1893-6514-4c35-b230-a25de8548762', 'Google Chat', 'https://mail.google.com/', 'GoogleChat.png', null, 2);
insert into public.links_link (section_id, title, url, image, style, sort) values ('b3be1893-6514-4c35-b230-a25de8548762', 'Google Maps', 'https://maps.google.com/', 'GoogleMaps.png', 'br-20', 3);
insert into public.links_link (section_id, title, url, image, style, sort) values ('b3be1893-6514-4c35-b230-a25de8548762', 'Google Earth', 'https://earth.google.com/', 'GoogleEarth.png', 'br-20', 4);
-- chess
insert into public.links_section (id, title, collapsed) values ('8cd81098-3482-40ba-acb1-98c06b74cc8e', 'Chess', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8cd81098-3482-40ba-acb1-98c06b74cc8e', 'Lichess', 'https://lichess.org/', 'Lichess.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8cd81098-3482-40ba-acb1-98c06b74cc8e', 'ChessKid', 'https://www.chesskid.com/', 'ChessKid.png', 'br-20', 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8cd81098-3482-40ba-acb1-98c06b74cc8e', 'Chess.com', 'https://www.chess.com/', 'chessDotCom.png', 'br-20', 2);
-- typing
insert into public.links_section (id, title, collapsed) values ('e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 'Typing', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 'Typing', 'https://www.typing.com/student/lessons', 'homeschooling/typing.svg', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 'TypeTastic!', 'https://typetastic.com/learn.html', 'TypeTastic.png', 'br-20', 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 'Mario Teaches Typing', 'https://playclassic.games/games/educational-dos-games-online/play-mario-teaches-typing-online/play/', 'MarioTeachesTyping.png', 'br-10', 2);
-- misc-learning
insert into public.links_section (id, title, collapsed) values ('a3ca54bb-7dab-4538-be53-48b72684b5e3', 'Misc. Learning Stuff', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('a3ca54bb-7dab-4538-be53-48b72684b5e3', 'Neighborhood Good', 'https://ed.icivics.org/node/1814/resource', 'NeighborhoodGood.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('a3ca54bb-7dab-4538-be53-48b72684b5e3', 'Internal Combustion Engine', 'https://ciechanow.ski/internal-combustion-engine/', 'InternalCombustionEngine.png', null, 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('a3ca54bb-7dab-4538-be53-48b72684b5e3', 'Regular Tixy', 'https://www.mathsuniverse.com/tixy/', 'tixy.png', 'br-20', 2);
insert into public.links_link (section_id, title, url, image, style, sort) values ('a3ca54bb-7dab-4538-be53-48b72684b5e3', 'MolView', 'https://app.molview.com/', 'MolView.png', null, 3);
-- learning-games
insert into public.links_section (id, title, collapsed) values ('4bb97bfd-b564-468e-a088-6915f99299ef', 'Learning Games', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('4bb97bfd-b564-468e-a088-6915f99299ef', 'Custom Wordle', 'https://mywordle.strivemath.com/', 'CustomWordle.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('4bb97bfd-b564-468e-a088-6915f99299ef', 'Wordle', 'https://www.nytimes.com/games/wordle/index.html', 'Wordle.png', null, 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('4bb97bfd-b564-468e-a088-6915f99299ef', 'Hello Wordl', 'https://hellowordl.net/', 'HelloWordl.png', null, 2);
insert into public.links_link (section_id, title, url, image, style, sort) values ('4bb97bfd-b564-468e-a088-6915f99299ef', 'Nonograms', 'https://www.goobix.com/games/nonograms/', 'Nonograms.png', null, 3);
-- entertaining-games
insert into public.links_section (id, title, collapsed) values ('f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 'Entertaining Games', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 'Minecraft Classic', 'https://classic.minecraft.net/', 'MinecraftClassic.jfif', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 'Cut The Rope', 'https://www.crazygames.com/game/cut-the-rope-ebx/', 'CutTheRope.png', null, 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 'Snake Game', 'https://googlesnakemods.com/v/current/', 'SnakeGame.png', null, 2);
-- math
insert into public.links_section (id, title, collapsed) values ('5376c906-9ce0-486a-8f9c-ed81f09976e5', 'Math Stuff', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('5376c906-9ce0-486a-8f9c-ed81f09976e5', 'Kindergarten Math', 'https://www.ixl.com/math/kindergarten', 'KindergartenMath.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('5376c906-9ce0-486a-8f9c-ed81f09976e5', 'Money Drag', 'https://teacher.gynzy.com/en-us/board?content=745', 'homeschooling/money-drag.png', null, 1);
-- reading
insert into public.links_section (id, title, collapsed) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Reading Stuff', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Minecraft Library Books', 'https://docs.google.com/spreadsheets/d/1S8DT6gFK6Se2LPJyFh8o9837mNv8ZXBWYFEJUblUcZU/edit', 'MinecraftBooks.png', null, 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Wordville', 'https://wordville.com/', 'Wordville.png', 'br-20', 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Grammar Tools', 'https://jwed.co.uk/tools/', 'GrammarTools.png', null, 2);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Teach Your Monster to Read', 'https://www.teachyourmonster.org/u/21640347', 'monster.png', null, 3);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Letter Sounds', 'https://phonicsandstuff.com/phonemes', 'LetterSounds.png', null, 4);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'Morpheme Mix', 'https://phonicsandstuff.com/puzzles/morpheme-mix/', 'MorphemeMix.png', null, 5);
insert into public.links_link (section_id, title, url, image, style, sort) values ('ebafe6d1-cdf0-4875-928a-f17a753359d4', 'EdShed Letter Tiles', 'https://www.edshed.com/en-us/lettertiles', 'LetterTiles.png', null, 6);
-- ixl-math-games
insert into public.links_section (id, title, collapsed) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'IXL Math Games', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'One Hundred Snowballs', 'https://www.ixl.com/games/one_hundred_snowballs', 'OneHundredSnowballs.png', 'br-10', 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Birthday Candle Counting', 'https://www.ixl.com/games/birthday-candle-counting', 'BirthdayCandleCounting.png', 'br-10', 1);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Count Snakes', 'https://www.ixl.com/games/base-ten-fun-count-write-ones-a', 'CountSnakes.png', 'br-10', 2);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Counting Blocks Bingo', 'https://www.ixl.com/games/counting-blocks-bingo-ones-a', 'CountingBlocksBingo.png', 'br-5', 3);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Counting Fish', 'https://www.ixl.com/games/counting_fish', 'CountingFish.png', 'br-5', 4);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Fuzz Bugs: Counting, Sorting, Comparing', 'https://www.ixl.com/games/counting_sorting_comparing', 'FuzzBugsCountingSortingComparing.png', 'br-5', 5);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Fuzz Bugs: Patterns', 'https://www.ixl.com/games/fuzz_bugs_patterns', 'FuzzBugsPatterns.png', 'br-5', 6);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Monster Mansion: Number Match', 'https://www.ixl.com/games/monster-mansion-numbers-show-a', 'MonsterMansionNumberMatch.png', 'br-5', 7);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Monster Mansion: Number Memory Match', 'https://www.ixl.com/games/monster-mansion-numbers-memory-a', 'MonsterMansionNumberMemoryMatch.png', 'br-5', 8);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Number Bingo: 0 to 10', 'https://www.ixl.com/games/number-bingo-10-a', 'NumberBingo0To10.png', 'br-5', 9);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Number Bingo: 0 to 20', 'https://www.ixl.com/games/number-bingo-20-a', 'NumberBingo0To20.png', 'br-5', 10);
insert into public.links_link (section_id, title, url, image, style, sort) values ('8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 'Math Man: Addition', 'https://www.ixl.com/games/math-man-addition-a', 'MathManAddition.jpg', 'br-5', 11);
-- ixl-english-games
insert into public.links_section (id, title, collapsed) values ('31349f62-1bc3-49b3-a2e2-c0dd23236f53', 'IXL English Games', false);
insert into public.links_link (section_id, title, url, image, style, sort) values ('31349f62-1bc3-49b3-a2e2-c0dd23236f53', 'Sight Word Bingo', 'https://www.ixl.com/games/sight-word-bingo-pre-primer-a', 'SightWordBingo.png', 'br-5', 0);
insert into public.links_link (section_id, title, url, image, style, sort) values ('31349f62-1bc3-49b3-a2e2-c0dd23236f53', 'Alphabet Bingo: Uppercase Letters', 'https://www.ixl.com/games/alphabet-bingo-names-uppercase-a', 'AlphabetBingoUppercaseLetters.png', 'br-5', 1);

insert into public.links_page_section (page_slug, section_id, sort) values ('home', 'ae6d90fd-6816-4cd3-9008-b1fe00683647', 0);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', '6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 1);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', 'b3be1893-6514-4c35-b230-a25de8548762', 2);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', '8cd81098-3482-40ba-acb1-98c06b74cc8e', 3);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', 'e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 4);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', 'a3ca54bb-7dab-4538-be53-48b72684b5e3', 5);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', '4bb97bfd-b564-468e-a088-6915f99299ef', 6);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', 'f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 7);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', '5376c906-9ce0-486a-8f9c-ed81f09976e5', 8);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', 'ebafe6d1-cdf0-4875-928a-f17a753359d4', 9);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', '8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 10);
insert into public.links_page_section (page_slug, section_id, sort) values ('home', '31349f62-1bc3-49b3-a2e2-c0dd23236f53', 11);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '741d3fac-a310-400e-8eb8-4ce64549b5c7', 0);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', 'ae6d90fd-6816-4cd3-9008-b1fe00683647', 1);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 2);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', 'b3be1893-6514-4c35-b230-a25de8548762', 3);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '8cd81098-3482-40ba-acb1-98c06b74cc8e', 4);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', 'e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 5);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', 'a3ca54bb-7dab-4538-be53-48b72684b5e3', 6);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '4bb97bfd-b564-468e-a088-6915f99299ef', 7);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', 'f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 8);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '5376c906-9ce0-486a-8f9c-ed81f09976e5', 9);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', 'ebafe6d1-cdf0-4875-928a-f17a753359d4', 10);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 11);
insert into public.links_page_section (page_slug, section_id, sort) values ('luke', '31349f62-1bc3-49b3-a2e2-c0dd23236f53', 12);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '27c8103f-f3f8-47f5-a771-40380f1efb9a', 0);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 1);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', 'b3be1893-6514-4c35-b230-a25de8548762', 2);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '8cd81098-3482-40ba-acb1-98c06b74cc8e', 3);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', 'e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 4);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', 'a3ca54bb-7dab-4538-be53-48b72684b5e3', 5);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '4bb97bfd-b564-468e-a088-6915f99299ef', 6);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', 'f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 7);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '5376c906-9ce0-486a-8f9c-ed81f09976e5', 8);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', 'ebafe6d1-cdf0-4875-928a-f17a753359d4', 9);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 10);
insert into public.links_page_section (page_slug, section_id, sort) values ('nathan', '31349f62-1bc3-49b3-a2e2-c0dd23236f53', 11);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', '6dc52f3a-6ea3-43fb-b8b1-0ecb7f4db592', 0);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', 'b3be1893-6514-4c35-b230-a25de8548762', 1);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', '8cd81098-3482-40ba-acb1-98c06b74cc8e', 2);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', 'e6c598c2-06df-44c4-975f-3cdfa59e1b3d', 3);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', 'a3ca54bb-7dab-4538-be53-48b72684b5e3', 4);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', '4bb97bfd-b564-468e-a088-6915f99299ef', 5);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', 'f0ed2392-c5bb-49a3-8239-7de6bb7b4532', 6);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', '5376c906-9ce0-486a-8f9c-ed81f09976e5', 7);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', 'ebafe6d1-cdf0-4875-928a-f17a753359d4', 8);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', '8e8bf439-274f-4e1f-87cb-1e7f22eb8c19', 9);
insert into public.links_page_section (page_slug, section_id, sort) values ('daniel', '31349f62-1bc3-49b3-a2e2-c0dd23236f53', 10);
insert into public.links_page_section (page_slug, section_id, sort) values ('claudiu', 'b3be1893-6514-4c35-b230-a25de8548762', 0);

commit;
