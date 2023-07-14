<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Image;
use App\Models\Page;
use App\Models\Section;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return $route->named('site.page.*')? $route->getName() : false;
        })->filter()->all();

        $pages = [];
        foreach ($routes as $routeName) {
            $title = Str::replaceFirst('site.page.','', $routeName);
            $alias = $title;
            $title = $title == 'home' ? 'Главная страница' : $title;
            $pages[] = [
                'title' => $title,
                'alias' => $alias,
                'h1' => $title,
                'route' => $routeName,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('pages')->insert($pages);

        //-------------------- main page --------------------
        $page = Page::where('alias', 'home')->first();

        $sections = [
            [
                'title' => 'Электро авто из Китая',
                'content' => 'Электромобили из Китая от надежного импортера E-Drive. Только мировые известные бренды.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'slider',
                'sort' => 0,
            ],
            [
                'title' => 'Nissan Leaf',
                'content' => 'Доставим автомобиль из США быстро и надежно. Все аукционы Америки: IAAI, Copart&lt; Manheim с минимальной комиссией по лицензии авто дилера.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'slider',
                'sort' => 1,
            ],
            [
                'title' => 'Электромобили',
                'content' => 'Всегда в наличии и под заказ множество электромобилей лучших мировых брендов. Тихий, быстрый и абсолютно экологичный транспорт – это будущее, которое уверенно становится настоящим.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'tabs',
                'sort' => 0,
            ],
            [
                'title' => 'Заказ Авто из США',
                'content' => 'Диапазон, оборудование, и даже количество двигателей - все здесь немного отличается от традиционной автомобильной промышленности, часто увлекательной и очень современная.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'tabs',
                'sort' => 1,
            ],
            [
                'title' => 'Выберите авто полное энергии',
                'content' => 'Мы помогаем в выборе автомобиля из аукционов США, Канады и рынка Грузии, проверяем его историю и честно рассказываем об всех этапах заказа и транспортировки. Только после полной информации, Вы решаете заказывать автомобиль или воздержатся. Звоните и пишите нам, мы предоставим таблицу привезенных автомобилей для полного виденья экономии.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 0,
            ],
            [
                'title' => 'Экономия',
                'content' => 'Которое даст возможность экономить на покупке топлива и обслуживании мотора',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 1,
            ],
            [
                'title' => 'Последние техологии',
                'content' => 'Позволит наслаждаться последними технологиями, доступными в настоящее время',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 2,
            ],
            [
                'title' => 'Экстраординарный опыт',
                'content' => 'Обеспечит экстраординарный опыт вождения, даже при парковке',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 3,
            ],
            [
                'title' => 'Защиты окружающей среды',
                'content' => 'Участвуйте в общем деле защиты окружающей среды',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 4,
            ],
            [
                'title' => 'Конец заправкам!',
                'content' => 'Которое даст возможность заряжаться в домашних условиях (конец заправкам!)',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 5,
            ],
            [
                'title' => 'Путешествовать с удобством',
                'content' => 'Путешествовать с удобством и без каких-либо рисков.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'waypoint',
                'sort' => 6,
            ],
            [
                'title' => 'С уважением, Владимир Николаевич',
                'content' => 'В первую очередь хотел оценить мощность и маневренность Ниссан Лиф. Ясно, что сделать это
                                без тест-драйва было практически невозможно. Обратившись в Экокарз, я получил на тест-драйв
                                этот электромобиль, у меня уже не осталось сомнений в выборе. А выгодные условия лизинга
                                подстегивают совершить покупку как можно скорее, осталось решиться) Спасибо!',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'reviews',
                'sort' => 0,
            ],
            [
                'title' => 'С уважением Игорь Владимирович',
                'content' => 'В первую очередь хотел оценить мощность и маневренность Ниссан Лиф. Ясно, что сделать это
                                без тест-драйва было практически невозможно. Обратившись в Экокарз, я получил на тест-драйв
                                этот электромобиль, у меня уже не осталось сомнений в выборе. А выгодные условия лизинга
                                подстегивают совершить покупку как можно скорее, осталось решиться) Спасибо!',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'reviews',
                'sort' => 1,
            ],
        ];

        $sectionsDB = $page->sections()->createMany($sections);

        $imagesCollection = collect(Storage::disk('assets')->allFiles('/images/slider'));
        foreach ($imagesCollection as $image) {
            $images[] = Image::firstOrCreate([
                'url' => $image,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($sectionsDB->where('position', 'slider') as $n => $section) {
            $section->images()->save($images[$n], ['created_at' => now(), 'updated_at' => now()]);
            $section->sections()->create(['title' => 'url', 'content'=>'/test'.$n, 'sort' => $n, 'position' => 'slider']);
        }
        //-------------------- end main page --------------------



        //-------------------- cars page --------------------
        $categories = Category::get();

        $sections = [
            [
                'title' => 'Электромобили',
                'content' => <<<END
<p><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;"><strong>Электромобили и будущая их перспектива</strong></span></p>
<p><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Электромобиль приводится в движение с помощью электродвигателей, подпитывающихся от аккумуляторов или топливных элементов. Если вернуться в историю, то электрокары появились раньше, чем автомобили с двигателями внутреннего сгорания. Интерес же к таким авто возник гораздо позже, только во второй половине ХХ века начали развивать эту отрасль. Всё же на современных автострадах такое авто встречается редко, почему электрокары не могут завоевать бешеной популярности, как бензиновые авто или хотя бы отвоевать половину рынка от общей численности транспортных средств, давайте разбираться.</span></p>
<p><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;"><strong>Плюсы и минусы электрокаров</strong></span></p>
<ul>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Нет вредных выхлопов, не загрязняется окружающая среда;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Надёжный двигатель с повышенным периодом эксплуатации;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Недорогая стоимость зарядки в сравнении с топливом для авто;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Повышенный коэффициент КПД, в сравнении с мотором обычного авто;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Создают меньше шума;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Аккумулятор теряет много энергии при резких стартах и разных скоростях;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">На электрокарах не удастся совершить длительную поездку без подзарядки;</span></li>
<li><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Высокая цена электромобиля.</span></li>
</ul>
<p><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;"><strong>На какой планке находится популярность электрокаров</strong></span></p>
<p><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">В последнее время популяризация электротранспорта значительно повысилась. В основном это стало заметным в развитых странах Европы и в США. 2014 год знаменателен приростом электрокаров на дорогах Норвегии, в этот период они уже занимали там более 20% от всех транспортных средств. Способствовала такому положению государственная программа по очищению окружающей среды.При покупке электрокара в Норвегии, он не облагается налогом, автомобилисты могут парковаться на льготных парковках и ездить бесплатно по оплачиваемым участкам трасс.</span></p>
END,
                'pageable_type' => 'App\Models\Category',
                'pageable_id' => 'Электромобили',
                'position' => 'advantage',
                'sort' => 0,
            ],
            [
                'title' => 'test',
                'content' => 'test content',
                'pageable_type' => 'App\Models\Category',
                'pageable_id' => 'Электромобили',
                'position' => 'advantage',
                'sort' => 1,
            ],
            [
                'title' => 'Заказ авто из США',
                'content' => <<<END
<p><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><strong>Заказ авто из США</strong></span></p>
<p><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Существующий <strong>автомобильный рынок</strong> уже перенасыщен разнообразными авто со всех стран мира. Все же есть истинные ценители, отдающие предпочтение <strong>автомобилям из США</strong>. Ведь американские автомобили считаются самыми «честными», относительно мощности и оснастки, поэтому на них такой большой спрос. <strong>Купить авто из США</strong>, значит получить надежного железного друга, который не подведет в сложной ситуации.</span></p>
<p><br><strong><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;">Что представляет собой американский рынок подержанных автомобилей</span></strong></p>
<p><br><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">Это самый обширный рынок транспортных средств, здесь присутствуют как американские марки, так и модели с Европы. Вы будете удивлены, но еще несколько десятков лет назад в США были слабо развиты железнодорожные сообщения, это подтолкнуло население к эксплуатации автотранспорта. Традиция сохранилась и по нынешний день, каждая американская семья имеет авто, а у некоторых их несколько в гараже.</span><br><span style="font-family: arial, helvetica, sans-serif; font-size: 10pt;">К тому же американцы не ездят долго на своем новеньком автомобиле, а поэксплуатировав его пару лет, продают и обзаводятся новым. При этом свое авто они любят, оснащают его всевозможными гаджетами, дополнительным оборудованием. Выставляются же автомобили на аукционы, вместе с доукомплектацией, при этом, <strong>цена авто из США на порядок ниже</strong>, если учесть тот набор, с которым оно продается. Поэтому рынок подержанных американских авто представляет собой продажу практически новых автомобилей, с повышенным функционалом.</span></p>
END,
                'pageable_type' => 'App\Models\Category',
                'pageable_id' => 'Заказ Авто из США',
                'position' => 'advantage',
                'sort' => 0,
            ],
        ];
        foreach ($sections as $key => $section) {
            $categoryName = $section['pageable_id'];
            $category = $categories->where('title', $categoryName)->first();
            $section['pageable_id'] = $category->id;
            $category->sections()->create($section);
        }
        //-------------------- end cars page --------------------



        //-------------------- about page --------------------
        $page = Page::where('alias', 'about')->first();

        $sections = [
            [
                'title' => 'Текст под заголовком',
                'content' => <<<END
E-Drive крупнейший дилер авто из США и электромобилей в Киеве, Днепре, Одессе, Херсоне, Николаеве. Импортируем б/у модели, продаём, обслуживаем, поддерживаем. 
У нас можно чесно купить семейный и коммерческий автомобиль, получить экономию до 40% от преставленых аналогов на рынке Украины. Полное сопровождение при покупке, от выбора до таможеной очистке и сертификации.
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'header',
                'sort' => 0,
            ],
            [
                'title' => 'Автомобили в наличии и под заказ',
                'content' => <<<END
<h3>Автомобили в наличии и под заказ</h3>
<p>У Вас есть множество вариантов выбора идеального электромобиля, удовлетворяющего все требования.
 Станьте одним из пока ещё немногих обладателей этого чуда техники на территории Украины.</p>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'in_stock',
                'sort' => 0,
            ],
            [
                'title' => 'Тест-драйв',
                'content' => '<p>Возможность провести тест-драйв интересующего Вас электромобиля</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'testdrive',
                'sort' => 0,
            ],
            [
                'title' => 'С нами вы экономите',
                'content' => '<p>Возможность провести тест-драйв интересующего Вас электромобиля</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'econom',
                'sort' => 0,
            ],
            [
                'title' => 'Карта зарядок электромобилей',
                'content' => 'Сегодня в Украине интенсивно развивается инфраструктура для широкого использования электромобилей. Проблема расположения зарядных станций по Киеву практически решена на все 100%.',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'map',
                'sort' => 0,
            ],
            [
                'title' => 'Сервисная гарантия и поддержка',
                'content' => <<<END
<h3>Сервисная гарантия и поддержка</h3>
    <p>Автомобили всех наших клиентов подключены к дорожному ассистансу (вызов эвакуатора 24/7 в течении часа*)</p>
    <p><strong>Мы не только предлагаем купить электромобиль, но и всесторонне поддерживаем клиентов:</strong></p>
<ul class="circle">
    <li>
    <p>ускоряем процесс купли-продажи, регистрацию и страхование электрокара КАСКО и ГО. КАСКО &ndash; от 1% в год</p>
    </li>
    <li>
    <p>Все общественные зарядки для наших клиентов в Украине бесплатные</p>
    </li>
</ul>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'service',
                'sort' => 0,
            ],
            [
                'title' => 'Кроме электромобилей предлагаем самые популярные модели автотранспорта с аукционов США и любой точки америки.',
                'content' => <<<END
<h3>Кроме электромобилей предлагаем самые популярные&nbsp;модели автотранспорта с аукционов США и любой точки америки.</h3>
<p>Мы поможем подобрать и купить автомобиль на аукционах США, доставить его по територии Америки до порта, далее провести таможеную очистку на територии Украины, направить в сертификации и быстрой поставновке на учет.</p>
<p>Аукционы США на которых покупаються авто: IAAI, Copart, Manheim, Adessa, Cars.</p>
<p>Марки авто на Ваш вкус и выбор: Audi, Toyota, Kia, Hyundai, Ford, BMW, Mercedes, Honda, Mazda, Nissan, VolksWagen, Fiat, Dodge, Cadillac, Lexus, Jeep, Chevrolet и много других, так как рынок авто в США самый большой в Мире.</p>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'service2',
                'sort' => 0,
            ],
        ];
        $sectionsDB = $page->sections()->createMany($sections);

        $sectionsDB->where('position', 'header')->first()->images()->save(Image::firstOrCreate([
                'url' => 'images/about-1.jpg',
            ]), ['created_at' => now(), 'updated_at' => now()]);

        $sectionsDB->where('position', 'service')->first()->images()->save(Image::firstOrCreate([
                'url' => 'images/about-2.jpg',
            ]), ['created_at' => now(), 'updated_at' => now()]);

        $sectionsDB->where('position', 'service2')->first()->images()->save(Image::firstOrCreate([
                'url' => 'images/about-3.jpg',
            ]), ['created_at' => now(), 'updated_at' => now()]);

        //-------------------- end about page --------------------



        //-------------------- import page --------------------
        $page = Page::where('alias', 'import')->first();

        $sections = [
            [
                'title' => 'Текст под заголовком',
                'content' => <<<END
Мы осуществляем услуги по доставке автомобилей, мотоциклов, катеров и другой техники из США в Украину.
 Прямые договора с перевозчиками по США и морскими линиями позволяют нашей компании предоставлять быстрый и надёжный сервис на выгодных для Вас условиях.
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'header',
                'sort' => 0,
            ],
            [
                'title' => 'Почему выгодно заказывать транспортные средства из США?',
                'content' => <<<END
<h3>Почему выгодно заказывать транспортные средства из США?</h3>
<p>С 1 августа 2016 года вступает в силу закон о снижении акциза на б/у автомобили. Таким образом, покупатели подержанных транспортных средств смогут сэкономить от 4000 до 9000 евро. Цифра варьируется, в зависимости от литража двигателя. Данные условия действуют для легковых автомобилей, выпущенных не раньше 2010 года.</p>
<p>В связи с мировым кризисом, который сильно отразился на американском автопроме, автопроизводители значительно расширили стандартные комплектации автомобилей для привлечения покупателей.</p>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'profitable',
                'sort' => 0,
            ],
            [
                'title' => 'Этап 1',
                'content' => '<p>Вы оставляете нам заявку с указанным ТС или звоните нашим консультантам.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'stage1',
                'sort' => 0,
            ],
            [
                'title' => 'Этап 2',
                'content' => '<p>Мы подбираем вам наиболее подходящие варианты.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'stage2',
                'sort' => 0,
            ],
            [
                'title' => 'Этап 3',
                'content' => '<p>Вы вносите предоплату в размере 20% от стоимости транспортного средства.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'stage3',
                'sort' => 0,
            ],
            [
                'title' => 'Этап 4',
                'content' => '<p>Мы доставляем ТС из Америки по морю в Украину и производим процедуру растаможивания.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'stage4',
                'sort' => 0,
            ],
            [
                'title' => 'Преимущества покупки авто из США 1',
                'content' => '<p>Цены на новые и подержанные машины в США на 20%-40% ниже, чем в Украине, Европе и Азии.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'advantage1',
                'sort' => 0,
            ],
            [
                'title' => 'Преимущества покупки авто из США 2',
                'content' => '<p>Автомобили из США отличаются от европейских и азиатских аналогов высоким качеством сборки и надёжностью.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'advantage2',
                'sort' => 0,
            ],
            [
                'title' => 'Преимущества покупки авто из США 3',
                'content' => '<p>Благодаря качественному дорожному покрытию в США американские подержанные машины по своему техническому состоянию мало отличаются от новых.</p>',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'advantage3',
                'sort' => 0,
            ],
            [
                'title' => 'Площадки, на которых можно найти и подобрать хорошее авто',
                'content' => <<<END
<h3>Площадки, на которых можно найти и подобрать хорошее авто</h3>
<p>Автомобили всех наших клиентов подключены к дорожному ассистансу (вызов эвакуатора 24/7 в течении часа*)</p>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'platforms',
                'sort' => 0,
            ],
            [
                'title' => 'Тест-драйв электромобиля в один клик!',
                'content' => <<<END
<div class="top">
<h2 class="line">Тест-драйв электромобиля в один клик!</h2>
<h6 class="_h6">Компания E-drive первой выступила с выгодным коммерческим предложением, предоставив всем желающим возможность купить электромобиль одной из ведущих марок.</h6>
</div>
<div class="bottom">
<div>
<h3>Легко ли купить электромобиль в Киеве</h3>
<p>Всего несколько лет назад выбор экологически чистых и безопасных авто был чрезвычайно мал, господство двигателя внутреннего сгорания было безоговорочным, а инновационные модели уступали традиционным аналогам по всем характеристикам, равно как и по комфорту.</p>
<p>Заказать качественный и стильный электрический автомобиль стоило огромных денег. Сегодня, благодаря работе компании Green Motors, многие уже приняли решение купить электромобиль в Киеве и стали счастливыми владельцами новейших транспортных средств. Вы тоже хотите себе &laquo;автомобиль будущего&raquo;? Тогда изучите каталог имеющихся моделей и сделайте свой выбор уже сейчас.</p>
</div>
<div>
<h3>Купить недорогой электромобиль &mdash; теперь реально!</h3>
<p>Представленные здесь авто сгруппированы по маркам. Если вас привлекает фирменное качество определённого автоконцерна, можете остановить свой выбор на его продукции. Если вы пока не определились точно с тем, какому бренду отдать предпочтение, изучите каталог, сравните внешний вид, стоимость и технические характеристики моделей.</p>
<p>Старания компании E-drive привели к тому, что итоговая стоимость экологически чистого транспорта значительно уменьшилась. Теперь купить недорогой электромобиль, ни в чём не уступающий традиционному транспорту с двигателем внутреннего сгорания, проще простого. Всё, что вам нужно будет сделать, это просмотреть список доступных моделей и сделать свой выбор. При необходимости сотрудник компании готов ответить на ваши вопросы и проконсультировать по имеющемуся ассортименту.</p>
</div>
</div>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'testdrive',
                'sort' => 0,
            ],
        ];
        $sectionsDB = $page->sections()->createMany($sections);

        $sectionsDB->where('position', 'header')->first()->images()->save(Image::firstOrCreate([
            'url' => 'images/about-1.jpg',
        ]), ['created_at' => now(), 'updated_at' => now()]);

        $sectionsDB->where('position', 'platforms')->first()->images()->save(Image::firstOrCreate([
            'url' => 'images/pic-2.jpg',
        ]), ['created_at' => now(), 'updated_at' => now()]);
        //-------------------- end import page --------------------



        //-------------------- testdrive page --------------------
        $page = Page::where('alias', 'testdrive')->first();

        $sections = [
            [
                'title' => 'Текст под заголовком',
                'content' => <<<END
<p>Заявка на тест-драйв &ndash; это возможность бесплатно почувствовать все<br /> 
преимущества самых популярных электромобилей в мире.</p>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'header',
                'sort' => 0,
            ],
            [
                'title' => 'Тест-драйв электромобиля в один клик!',
                'content' => <<<END
<div class="top">
<h2 class="line">Тест-драйв электромобиля в один клик!</h2>
<p>Компания E-drive первой выступила с выгодным коммерческим предложением, предоставив всем желающим возможность купить<br /> электромобиль одной из ведущих марок.</p>
</div>
<div class="content">
<div class="_def-left">
<p>Такое приобретение станет настоящей находкой для всех, кто привык идти в ногу со временем:</p>
<ul class="circle">
<li>
<p>Электрический автомобиль &mdash; это сверхсовременное транспортное средство с великолепным дизайном и высокими эксплуатационными характеристиками.</p>
</li>
<li>
<p>Он ничем не хуже, чем авто с двигателем внутреннего сгорания, но значительное безопаснее и комфортнее.</p>
</li>
<li>
<p>Не нужно тратиться на топливо и масло. Достаточно заряжать аккумулятор в специально оборудованных для этого местах.</p>
</li>
<li>
<p>Поездки не причиняют вреда окружающей среде.</p>
</li>
</ul>
</div>
<div class="img _def-right"><img class="" src="/images/testdrive-content.jpg" alt="" width="720" height="440" /></div>
<div class="bottom _clear">
<h3>Легко ли купить электромобиль в Киеве</h3>
<p>Всего несколько лет назад выбор экологически чистых и безопасных авто был чрезвычайно мал, господство двигателя внутреннего сгорания было безоговорочным, а инновационные модели уступали традиционным аналогам по всем характеристикам, равно как и по комфорту.</p>
<p>Заказать качественный и стильный электрический автомобиль стоило огромных денег. Сегодня, благодаря работе компании Green Motors, многие уже приняли решение купить электромобиль в Киеве и стали счастливыми владельцами новейших транспортных средств. Вы тоже хотите себе &laquo;автомобиль будущего&raquo;? Тогда изучите каталог имеющихся моделей и сделайте свой выбор уже сейчас.</p>
<h3>Купить недорогой электромобиль &mdash; теперь реально!</h3>
<p>Представленные здесь авто сгруппированы по маркам. Если вас привлекает фирменное качество определённого автоконцерна, можете остановить свой выбор на его продукции. Если вы пока не определились точно с тем, какому бренду отдать предпочтение, изучите каталог, сравните внешний вид, стоимость и технические характеристики моделей.</p>
<p>Старания компании E-drive привели к тому, что итоговая стоимость экологически чистого транспорта значительно уменьшилась. Теперь купить недорогой электромобиль, ни в чём не уступающий традиционному транспорту с двигателем внутреннего сгорания, проще простого. Всё, что вам нужно будет сделать, это просмотреть список доступных моделей и сделать свой выбор. При необходимости сотрудник компании готов ответить на ваши вопросы и проконсультировать по имеющемуся ассортименту.</p>
</div>
</div>
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'testdrive',
                'sort' => 0,
            ],
        ];
        $page->sections()->createMany($sections);
        //-------------------- end testdrive page --------------------



        //-------------------- contacts page --------------------
        $page = Page::where('alias', 'contact')->first();

        $sections = [
            [
                'title' => 'Текст под заголовком',
                'content' => <<<END
Вы скоро убедитесь, как можно экономить и надежно заказывать авто из Америки.
Мы готовы ответить на все Ваши вопросы. Выберите удобную форму контакта с нами.
END,
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'header',
                'sort' => 0,
            ],
            [
                'title' => 'longitude',
                'content' => '30.711443424224854',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'longitude',
                'sort' => 0,
            ],
            [
                'title' => 'latitude',
                'content' => '46.393592377136244',
                'pageable_type' => 'App\Models\Page',
                'pageable_id' => $page->id,
                'position' => 'latitude',
                'sort' => 0,
            ],
        ];
        $page->sections()->createMany($sections);
        //-------------------- end contacts page --------------------
    }
}
