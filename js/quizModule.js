/**
 * Module 4: ცოდნის შემოწმება და პრაქტიკული ამოცანები
 * Formative Assessment & Real-World Scenarios
 * Aligned with Georgian National Curriculum (ესგ, X კლასი)
 */

class QuizModule {
  constructor() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = {}; // { questionId: { selectedOption, isCorrect, answeredAt } }

    this.questions = [
      {
        id: 1,
        title: 'სცენარი 1: მაცივარი და საკვების შენახვა',
        badge: 'ტემპერატურა და სიჩქარე',
        context: 'ზაფხულის ცხელ დღეს ოთახის ტემპერატურაზე (+28°C) დატოვებული რძე ან ხორცი რამდენიმე საათში მჟავდება და ფუჭდება, ხოლო საყოფაცხოვრებო მაცივარში (+4°C-ზე) იგივე პროდუქტი რამდენიმე დღის განმავლობაში უცვლელად ინახება.',
        question: 'დაჯახებათა თეორიის (Collision Theory) მიხედვით, რა არის ამ მოვლენის ძირითადი სამეცნიერო მიზეზი?',
        options: [
          {
            text: 'დაბალ ტემპერატურაზე ნაწილაკების საშუალო სიჩქარე იკლებს და მკვეთრად მცირდება იმ მოლეკულების წილი, რომელთა ენერგია აღემატება აქტივაციის ენერგიას (E ≥ Ea).',
            isCorrect: true,
            rationale: 'ზუსტად ასეა! ტემპერატურის შემცირება ამცირებს ნაწილაკების კინეტიკურ ენერგიას. ვანტ-ჰოფის წესით, ტემპერატურის ყოველ 10°C-ით შემცირებისას რეაქციის სიჩქარე 2-4-ჯერ იკლებს. ბაქტერიული დაჟანგვისა და ლპობის რეაქციები პრაქტიკულად ჩერდება.'
          },
          {
            text: 'მაცივრის დახურულ სივრცეში ჰაერის წნევა იზრდება, რაც წონასწორობას რეაგენტების მხარეს ხრის.',
            isCorrect: false,
            rationale: 'საყოფაცხოვრებო მაცივარში წნევა ატმოსფერულის ტოლია (1 ატმ). წნევა თხევად და მყარ პროდუქტებზე გავლენას არ ახდენს.'
          },
          {
            text: 'სიცივეში საკვებში არსებული ნივთიერებების კონცენტრაცია ნულამდე მცირდება.',
            isCorrect: false,
            rationale: 'ნივთიერებათა მასა და კონცენტრაცია გაცივებით არ ქრება (მასის მუდმივობის კანონი).'
          },
          {
            text: 'დაბალი ტემპერატურა მოქმედებს როგორც კატალიზატორი და ცვლის რეაქციის სითბურ ეფექტს (ΔH).',
            isCorrect: false,
            rationale: 'ტემპერატურა არ არის კატალიზატორი. კატალიზატორი ნივთიერებაა, რომელიც ამცირებს Ea-ს, ხოლო სიცივე პირიქით — ანელებს ნაწილაკებს.'
          }
        ],
        hint: 'გაიხსენეთ: როგორ არის დამოკიდებული ნაწილაკების კინეტიკური ენერგია და დაჯახებათა ეფექტურობა ტემპერატურაზე?'
      },
      {
        id: 2,
        title: 'სცენარი 2: კოცონის ანთება და შეშის დაპობა',
        badge: 'ზედაპირის ფართობი',
        context: 'ტურისტულ ლაშქრობაში მოსწავლეებმა სცადეს ცეცხლის დანთება მსხვილი ხის მორით, თუმცა ასანთით მისი აალება ვერ შეძლეს. შემდეგ მათ იგივე მორი დაჩეხეს წვრილ ნაფოტებად და ნახერხად, რის შემდეგაც ცეცხლი წამებში აინთო და ძლიერი ალით დაიწყო წვა.',
        question: 'რატომ იწვის წვრილად დაქუცმაცებული ხე შეუდარებლად სწრაფად, ვიდრე მთლიანი მორი?',
        options: [
          {
            text: 'დაქუცმაცებისას მკვეთრად იზრდება მყარი ნივთიერების ზედაპირის ფართობი, რაც ზრდის ჟანგბადის მოლეკულებთან შეხების წერტილებს და ეფექტურ დაჯახებათა სიხშირეს.',
            isCorrect: true,
            rationale: 'ბრწყინვალეა! წვა ჰეტეროგენული პროცესია (მყარი ხე + აირადი O₂). მთლიან მორში ჟანგბადი მხოლოდ გარე გარსს ეხება, ხოლო ნაფოტებად დაპობისას ზედაპირის ფართობი ასობითჯერ იზრდება!'
          },
          {
            text: 'წვრილ ნაფოტებს ქიმიურად უფრო დაბალი აქტივაციის ენერგია (Ea) აქვთ, ვიდრე მსხვილ მორს.',
            isCorrect: false,
            rationale: 'ორივე შემთხვევაში ხის (ცელულოზის) ქიმიური შედგენილობა და ბმის ენერგია იდენტურია, ამიტომ Ea არ იცვლება.'
          },
          {
            text: 'დაქუცმაცებისას რეაქციის სითბური ეფექტი (ΔH) ორმაგდება.',
            isCorrect: false,
            rationale: 'რეაქციის სითბური ეფექტი დამოკიდებულია ნივთიერების ბუნებასა და რაოდენობაზე (ჰესის კანონი), დაქუცმაცება მას არ ზრდის.'
          },
          {
            text: 'ნაფოტები შეიცავენ ბუნებრივ კატალიზატორს, რომელიც მორის გულში არ გვხვდება.',
            isCorrect: false,
            rationale: 'შეშა არ შეიცავს კატალიზატორს — ეფექტი მთლიანად განპირობებულია გეომეტრიული ზედაპირის ფართობით.'
          }
        ],
        hint: 'ჰეტეროგენულ რეაქციაში სად ხდება ნივთიერებების შეჯახება — მოცულობის სიღრმეში თუ ფაზათა გამყოფ ზედაპირზე?'
      },
      {
        id: 3,
        title: 'სცენარი 3: ავტომობილის კატალიზური გარდამქმნელი',
        badge: 'კატალიზატორი',
        context: 'ავტომობილის ძრავაში საწვავის წვისას წარმოიქმნება ტოქსიკური აირები: ნახშირბადის მონოქსიდი (CO) და აზოტის ოქსიდები (NOx). გამონაბოლქვ მილში დამონტაჟებულია კატალიზატორი (პლატინისა და როდიუმის საფარით), სადაც წამის მეასედებში მიმდინარეობს რეაქცია: 2CO + 2NO → 2CO₂ + N₂.',
        question: 'რა როლს ასრულებს პლატინის კატალიზატორი მოცემულ გარდაქმნაში?',
        options: [
          {
            text: 'ის უზრუნველყოფს რეაქციის ალტერნატიულ გზას გაცილებით დაბალი აქტივაციის ენერგიით (Ea), თვითონ კი რეაქციაში არ იხარჯება.',
            isCorrect: true,
            rationale: 'სწორია! პლატინა თავის ზედაპირზე ადსორბირებს CO-სა და NO-ს მოლეკულებს, ასუსტებს მათ შიდა ბმებს და დაბალ ენერგეტიკულ ბარიერზე წარმართავს რეაქციას, თვითონ კი უცვლელი რჩება.'
          },
          {
            text: 'პლატინა რეაქციაში იხარჯება როგორც ერთ-ერთი ძირითადი რეაგენტი და წარმოქმნის მარილებს.',
            isCorrect: false,
            rationale: 'კატალიზატორის განმარტებით, ის რეაქციის ბოლოს რჩება ქიმიურად უცვლელი და რაოდენობრივად იგივე.'
          },
          {
            text: 'კატალიზატორი წონასწორობას ხრის მარჯვნივ და ზრდის პროდუქტების წონასწორულ გამოსავლიანობას.',
            isCorrect: false,
            rationale: 'გახსოვდეთ: კატალიზატორი წონასწორობის მდგომარეობას არ ცვლის! ის მხოლოდ აჩქარებს წონასწორობის დამყარებას.'
          },
          {
            text: 'პლატინა შთანთქავს რეაქციის მთელ სითბოს და აქრობს ტემპერატურას.',
            isCorrect: false,
            rationale: 'პირიქით, კატალიზატორში რეაქცია ეგზოთერმულია და სისტემა ძალიან ცხელია.'
          }
        ],
        hint: 'როგორ მოქმედებს კატალიზატორი ენერგეტიკულ ბარიერზე და იხარჯება თუ არა ის პროცესში?'
      },
      {
        id: 4,
        title: 'სცენარი 4: ჰაბერ-ბოშის ამიაკის სინთეზი',
        badge: 'წონასწორობა და წნევა',
        context: 'მსოფლიო სოფლის მეურნეობის აზოტოვანი სასუქებით უზრუნველსაყოფად ქარხნებში მიმდინარეობს ჰაბერის სინთეზი: N₂(აირ) + 3H₂(აირ) ⇌ 2NH₃(აირ) + 92.4 კჯ. რეაქტორში წნევა აყვანილია 200 ატმოსფერომდე.',
        question: 'ლე შატელიეს პრინციპის მიხედვით, რატომ არის აუცილებელი მაღალი წნევა (200 ატმ) ამიაკის მაქსიმალური გამოსავლიანობისთვის?',
        options: [
          {
            text: 'მარცხნივ არის 4 მოლი აირი (1N₂ + 3H₂), ხოლო მარჯვნივ — 2 მოლი (2NH₃). წნევის გაზრდისას წონასწორობა გადაიხრება ნაკლები მოცულობისა და მოლებისკენ, ე.ი. ამიაკისკენ.',
            isCorrect: true,
            rationale: 'შესანიშნავი ლოგიკაა! სისტემა წნევის გაზრდას პასუხობს მოლეკულების რიცხვის შემცირებით (4 მოლი აირიდან 2 მოლამდე), ამიტომ წონასწორობა გადაიხრება მარჯვნივ — ამიაკის წარმოქმნის მხარეს.'
          },
          {
            text: 'მაღალი წნევა შლის აზოტის ატომებს ელექტრონებად და პროტონებად.',
            isCorrect: false,
            rationale: '200 ატმოსფერო ქიმიური პროცესია და ატომის ბირთვულ დაშლას ვერ გამოიწვევს.'
          },
          {
            text: 'წნევის გაზრდა წონასწორობას ხრის მარცხნივ, რათა რეაგენტები არ ამოიწუროს.',
            isCorrect: false,
            rationale: 'მარცხნივ მეტი მოლია (4 მოლი), ამიტომ მარცხნივ გადახრა წნევას კიდევ უფრო გაზრდიდა, რაც ეწინააღმდეგება ლე შატელიეს პრინციპს.'
          },
          {
            text: 'წნევა გავლენას არ ახდენს, რადგან ყველა კომპონენტი აირად მდგომარეობაშია.',
            isCorrect: false,
            rationale: 'პირიქით: წნევა გავლენას ახდენს მხოლოდ მაშინ, როდესაც რეაქციაში მონაწილეობს აირი და მარცხენა და მარჯვენა მხარეს აირთა მოლების რაოდენობა განსხვავებულია!'
          }
        ],
        hint: 'დაითვალეთ აირთა კოეფიციენტები: 1 + 3 = 4 მოლი მარცხნივ, 2 მოლი მარჯვნივ. საით არის ნაკლები მოცულობა?'
      },
      {
        id: 5,
        title: 'სცენარი 5: გაზიანი სასმელის გახსნა',
        badge: 'წონასწორობა და წნევის ვარდნა',
        context: 'მინერალური წყლის ან ლიმონათის დახურულ ბოთლში დამყარებულია დინამიკური წონასწორობა: CO₂(ხსნარი) ⇌ CO₂(აირი). როგორც კი თავსახურს მოვხსნით, ისმის მკვეთრი ხმა და სითხიდან მყისიერად იწყება გაზის ბუშტუკების ინტენსიური გამოყოფა.',
        question: 'რა იწვევს ნახშირორჟანგის მასობრივ გამოყოფას ბოთლის გახსნის შემდეგ?',
        options: [
          {
            text: 'თავსახურის მოხსნით წნევა მკვეთრად ვარდება 1 ატმ-მდე. ლე შატელიეს პრინციპით, სისტემა ცდილობს წნევის აღდგენას და წონასწორობა გადაიხრება აირის წარმოქმნისკენ (მარჯვნივ).',
            isCorrect: true,
            rationale: 'ზუსტი ახსნაა! ჰენრის კანონისა და ლე შატელიეს პრინციპის თანახმად, წნევის შემცირება ამცირებს აირის ხსნადობას სითხეში — წონასწორობა გადაიხრება აირადი ფაზისკენ.'
          },
          {
            text: 'ჰაერში არსებული აზოტი ერევა სითხეს და ქიმიურად გამოდევნის ნახშირორჟანგს.',
            isCorrect: false,
            rationale: 'აზოტი ინერტული აირია და წყალში გახსნილ CO₂-თან ქიმიურ რეაქციაში არ შედის.'
          },
          {
            text: 'ბოთლის გახსნისთანავე სითხის ტემპერატურა მყისიერად 50 გრადუსით იმატებს.',
            isCorrect: false,
            rationale: 'ბოთლის გახსნისას ტემპერატურა არ იმატებს (აირის გაფართოება პირიქით, მიკრო-გაცივებასაც კი იწვევს).'
          },
          {
            text: 'თავსახური ასრულებდა კატალიზატორის როლს და მისი მოხსნით რეაქცია შეჩერდა.',
            isCorrect: false,
            rationale: 'თავსახური მექანიკური ბარიერია წნევის შესანარჩუნებლად და არა ქიმიური კატალიზატორი.'
          }
        ],
        hint: 'რა დაემართა წნევას ბოთლში ჰერმეტული ხუფის მოხსნის შემდეგ?'
      },
      {
        id: 6,
        title: 'სცენარი 6: მურა აირის გაცხელება',
        badge: 'ტემპერატურა და შეფერილობა',
        context: 'ლაბორატორიაში დალუქულ კოლბაში მოთავსებულია აირთა ნარევი: 2NO₂(მურა აირი) ⇌ N₂O₄(უფერო აირი) + 57.2 კჯ. მოსწავლემ კოლბა ჩადგა ცხელი წყლის აბაზანაში (+80°C) და შეამჩნია, რომ აირის შეფერილობა საგრძნობლად გამუქდა (გახდა მუქი წითელ-ყავისფერი).',
        question: 'რატომ გამუქდა გაზის შეფერილობა გაცხელების შედეგად?',
        options: [
          {
            text: 'პირდაპირი რეაქცია ეგზოთერმულია (+Q). გაცხელებისას სისტემა ცდილობს ჭარბი სითბოს შთანთქმას და წონასწორობა გადაიხრება ენდოთერმული (შებრუნებული) რეაქციისკენ — წარმოიქმნება მეტი მურა NO₂.',
            isCorrect: true,
            rationale: 'სრულყოფილი პასუხია! ტემპერატურის გაზრდა ყოველთვის ხრის წონასწორობას ენდოთერმული მიმართულებით (-Q). რადგან პირდაპირი რეაქცია გამოყოფს სითბოს, შებრუნებული შთანთქავს მას — ამიტომ N₂O₄ იშლება მურა NO₂-ად და ჭურჭელი მუქდება.'
          },
          {
            text: 'გაცხელებამ გამოიწვია უფერო N₂O₄-ის კონცენტრაციის ზრდა.',
            isCorrect: false,
            rationale: 'თუ N₂O₄ გაიზრდებოდა, კოლბა უნდა გაუფერულებულიყო, არადა პირობაში ნათქვამია, რომ ის გამუქდა.'
          },
          {
            text: 'გაცხელებისას NO₂ მოლეკულები გარდაიქმნენ მყარ ჭვარტლად.',
            isCorrect: false,
            rationale: 'აზოტის დიოქსიდი აირია და ამ ტემპერატურაზე ჭვარტლს არ წარმოქმნის.'
          },
          {
            text: 'მინის კოლბა შევიდა რეაქციაში აზოტთან და შეიღება.',
            isCorrect: false,
            rationale: 'ქიმიური მინა ინერტულია მოცემულ პირობებში.'
          }
        ],
        hint: 'პირდაპირი რეაქციის სითბური ეფექტია +57.2 კჯ (ეგზოთერმული). საით გადაიხრება წონასწორობა ტემპერატურის მომატებისას ლე შატელიეს კანონით?'
      },
      {
        id: 7,
        title: 'ამოცანა 7 (რაოდენობრივი): რეაქციის საშუალო სიჩქარის გამოთვლა',
        badge: 'რაოდენობრივი ამოცანა • სიჩქარე',
        context: 'ქიმიურ რეაქტორში მიმდინარეობს რეაქცია: A + 2B → C. ექსპერიმენტის დასაწყისში (t₁ = 0 წმ) რეაგენტი A-ს საწყისი კონცენტრაცია იყო C₁ = 0.80 მოლი/ლ. რეაქციის დაწყებიდან 20 წამის შემდეგ (t₂ = 20 წმ) A ნივთიერების კონცენტრაციამ შეადგინა C₂ = 0.20 მოლი/ლ.',
        question: 'გამოთვალეთ მოცემული რეაქციის საშუალო სიჩქარე (v) მოცემულ დროის შუალედში A ნივთიერების მიხედვით [მოლი/(ლ·წმ)]:',
        options: [
          {
            text: 'v = 0.03 მოლი/(ლ·წმ)',
            isCorrect: true,
            rationale: 'ზუსტი და უნაკლო გამოთვლაა! რეაქციის სიჩქარის ფორმულით: v = -ΔC_A / Δt = -(C₂ - C₁) / (t₂ - t₁) = -(0.20 - 0.80) / (20 - 0) = 0.60 / 20 = 0.03 მოლი/(ლ·წმ).'
          },
          {
            text: 'v = 0.06 მოლი/(ლ·წმ)',
            isCorrect: false,
            rationale: 'დააკვირდით: 0.06 მიიღება, თუ კონცენტრაციის სხვაობას (0.60) 10-ზე გავყოფთ ან B ნივთიერების კოეფიციენტს არასწორად გავითვალისწინებთ. A ნივთიერებისთვის: 0.60 / 20 = 0.03 მოლი/(ლ·წმ).'
          },
          {
            text: 'v = 0.015 მოლი/(ლ·წმ)',
            isCorrect: false,
            rationale: 'ეს მნიშვნელობა მიიღებოდა, თუ სიჩქარეს 2-ზე გაყოფდით. A ნივთიერების სტექიომეტრიული კოეფიციენტი 1-ია, ამიტომ v = 0.60 / 20 = 0.03 მოლი/(ლ·წმ).'
          },
          {
            text: 'v = 0.60 მოლი/(ლ·წმ)',
            isCorrect: false,
            rationale: '0.60 არის კონცენტრაციის ცვლილება (ΔC = 0.80 - 0.20), თუმცა სიჩქარის მისაღებად ის აუცილებლად უნდა გაიყოს დროზე (Δt = 20 წმ).'
          }
        ],
        hint: 'გამოიყენეთ ქიმიური რეაქციის სიჩქარის ძირითადი ფორმულა: v = -ΔC / Δt = (C₁ - C₂) / (t₂ - t₁). ჩასვით: C₁ = 0.80, C₂ = 0.20, Δt = 20 წმ.'
      },
      {
        id: 8,
        title: 'ამოცანა 8 (რაოდენობრივი): წონასწორობის მუდმივის (K) გამოთვლა',
        badge: 'რაოდენობრივი ამოცანა • წონასწორობა',
        context: '1 ლიტრი მოცულობის დახურულ ჭურჭელში მუდმივ ტემპერატურაზე დამყარდა ჰომოგენური ქიმიური წონასწორობა: H₂(აირ) + I₂(აირ) ⇌ 2HI(აირ). წონასწორობის მომენტში ექსპერიმენტულად გაზომილი იქნა კომპონენტების წონასწორული კონცენტრაციები: [H₂] = 0.20 მოლი/ლ, [I₂] = 0.20 მოლი/ლ და [HI] = 0.80 მოლი/ლ.',
        question: 'გამოთვალეთ მოცემული შექცევადი რეაქციის წონასწორობის მუდმივა (K):',
        options: [
          {
            text: 'K = 16',
            isCorrect: true,
            rationale: 'ბრწყინვალეა! მასათა მოქმედების კანონის თანახმად: K = [HI]² / ([H₂] · [I₂]) = (0.80)² / (0.20 · 0.20) = 0.64 / 0.04 = 16. გახსოვდეთ: პროდუქტის კონცენტრაცია ხარისხდება მის სტექიომეტრიულ კოეფიციენტში (2)!'
          },
          {
            text: 'K = 4',
            isCorrect: false,
            rationale: 'თუ HI-ს კოეფიციენტს (2) უგულებელვყოფთ და არ ავიყვანთ კვადრატში: 0.80 / (0.20 · 0.20) = 20, ხოლო 0.80 / 0.20 = 4. მასათა მოქმედების კანონით კოეფიციენტი ხარისხის მაჩვენებელია: [HI]² = 0.64, 0.64 / 0.04 = 16.'
          },
          {
            text: 'K = 20',
            isCorrect: false,
            rationale: '20 მიიღება, თუ ფორმულაში [HI]-ს არ ავიყვანთ კვადრატში: 0.80 / 0.04 = 20. სწორი გამოსახულებაა: [HI]² / ([H₂]·[I₂]) = 0.64 / 0.04 = 16.'
          },
          {
            text: 'K = 2',
            isCorrect: false,
            rationale: 'გაიხსენეთ: მრიცხველში იწერება პროდუქტის წონასწორული კონცენტრაცია კვადრატში ([HI]² = 0.64), ხოლო მნიშვნელში რეაგენტების კონცენტრაციათა ნამრავლი ([H₂]·[I₂] = 0.04).'
          }
        ],
        hint: 'მასათა მოქმედების კანონით: K = [HI]² / ([H₂] · [I₂]). ყურადღება მიაქციეთ: HI-ის კოეფიციენტია 2, ამიტომ [HI] ადის კვადრატში: (0.80)² = 0.64!'
      }
    ];

    this.init();
  }

  init() {
    this.renderQuestion();
    this.setupListeners();
    this.updateProgressBar();
    this.setupMassActionProblems();
  }

  setupMassActionProblems() {
    const btnReveal1 = document.getElementById('btnRevealSolution1');
    const sol1 = document.getElementById('solutionBox1');
    if (btnReveal1 && sol1) {
      btnReveal1.addEventListener('click', () => {
        const isHidden = sol1.classList.contains('hidden');
        sol1.classList.toggle('hidden', !isHidden);
        btnReveal1.innerHTML = isHidden 
          ? '🙈 ამოხსნის დამალვა' 
          : '💡 ამოხსნისა და პასუხის ნახვა';
      });
    }

    const btnReveal2 = document.getElementById('btnRevealSolution2');
    const sol2 = document.getElementById('solutionBox2');
    if (btnReveal2 && sol2) {
      btnReveal2.addEventListener('click', () => {
        const isHidden = sol2.classList.contains('hidden');
        sol2.classList.toggle('hidden', !isHidden);
        btnReveal2.innerHTML = isHidden 
          ? '🙈 ამოხსნის დამალვა' 
          : '💡 ამოხსნისა და პასუხის ნახვა';
      });
    }
  }

  setupListeners() {
    const btnNext = document.getElementById('btnQuizNext');
    const btnPrev = document.getElementById('btnQuizPrev');
    const btnHint = document.getElementById('btnQuizHint');
    const btnResetQuiz = document.getElementById('btnQuizReset');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.renderQuestion();
          this.updateProgressBar();
        } else {
          this.renderResults();
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.renderQuestion();
          this.updateProgressBar();
        }
      });
    }

    if (btnHint) {
      btnHint.addEventListener('click', () => {
        this.toggleHint();
      });
    }

    if (btnResetQuiz) {
      btnResetQuiz.addEventListener('click', () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = {};
        const resultsBox = document.getElementById('quizResultsContainer');
        const questionBox = document.getElementById('quizActiveQuestionContainer');
        if (resultsBox) resultsBox.classList.add('hidden');
        if (questionBox) questionBox.classList.remove('hidden');
        this.renderQuestion();
        this.updateProgressBar();
      });
    }
  }

  updateProgressBar() {
    const bar = document.getElementById('quizProgressBar');
    const text = document.getElementById('quizProgressText');
    const answeredCount = Object.keys(this.userAnswers).length;
    const total = this.questions.length;
    const pct = Math.round((answeredCount / total) * 100);

    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `შეკითხვა ${this.currentQuestionIndex + 1} / ${total} (პასუხგაცემულია: ${answeredCount}/${total})`;

    // Nav button states
    const btnPrev = document.getElementById('btnQuizPrev');
    const btnNext = document.getElementById('btnQuizNext');
    if (btnPrev) btnPrev.disabled = (this.currentQuestionIndex === 0);
    if (btnNext) {
      const isAnswered = !!this.userAnswers[this.currentQuestionIndex];
      btnNext.textContent = (this.currentQuestionIndex === this.questions.length - 1) ? '🏁 შედეგების ნახვა' : 'შემდეგი ამოცანა →';
    }
  }

  toggleHint() {
    const hintBox = document.getElementById('quizHintBox');
    if (!hintBox) return;
    const isHidden = hintBox.classList.contains('hidden');
    if (isHidden) {
      const q = this.questions[this.currentQuestionIndex];
      hintBox.innerHTML = `
        <div class="p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg text-sm text-amber-200 flex items-start gap-2">
          <span class="text-base">💡</span>
          <div>
            <strong>მეთოდოლოგიური მინიშნება:</strong> ${q.hint}
          </div>
        </div>
      `;
      hintBox.classList.remove('hidden');
    } else {
      hintBox.classList.add('hidden');
    }
  }

  renderQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    const cardTitle = document.getElementById('quizQuestionTitle');
    const cardBadge = document.getElementById('quizQuestionBadge');
    const cardContext = document.getElementById('quizQuestionContext');
    const cardPrompt = document.getElementById('quizQuestionPrompt');
    const optionsContainer = document.getElementById('quizOptionsList');
    const feedbackBox = document.getElementById('quizFeedbackBox');
    const hintBox = document.getElementById('quizHintBox');

    if (hintBox) hintBox.classList.add('hidden');
    if (cardTitle) cardTitle.textContent = q.title;
    if (cardBadge) cardBadge.textContent = q.badge;
    if (cardContext) cardContext.textContent = q.context;
    if (cardPrompt) cardPrompt.textContent = q.question;

    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    const savedAnswer = this.userAnswers[this.currentQuestionIndex];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 text-sm leading-relaxed ';
      
      if (savedAnswer !== undefined) {
        btn.disabled = true;
        if (opt.isCorrect) {
          btn.className += 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold';
        } else if (savedAnswer === idx) {
          btn.className += 'bg-rose-950/60 border-rose-500/60 text-rose-200';
        } else {
          btn.className += 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60';
        }
      } else {
        btn.className += 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 hover:border-sky-500/50 text-slate-200 hover:text-white cursor-pointer';
      }

      const letter = String.fromCharCode(65 + idx); // A, B, C, D
      btn.innerHTML = `
        <span class="w-6 h-6 rounded-full bg-slate-700/80 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">${letter}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => {
        this.handleSelectOption(idx);
      });

      optionsContainer.appendChild(btn);
    });

    if (feedbackBox) {
      if (savedAnswer !== undefined) {
        const selectedOpt = q.options[savedAnswer];
        feedbackBox.classList.remove('hidden');
        feedbackBox.innerHTML = `
          <div class="p-4 rounded-xl border ${selectedOpt.isCorrect ? 'bg-emerald-950/50 border-emerald-500/40' : 'bg-rose-950/50 border-rose-500/40'}">
            <div class="flex items-center gap-2 mb-2 font-bold ${selectedOpt.isCorrect ? 'text-emerald-300' : 'text-rose-300'}">
              <span>${selectedOpt.isCorrect ? '✅ შესანიშნავია! სწორი პასუხია' : '🔍 საინტერესო მოსაზრებაა, თუმცა დაფიქრდით:'}</span>
            </div>
            <p class="text-sm text-slate-300 leading-relaxed">${selectedOpt.rationale}</p>
          </div>
        `;
      } else {
        feedbackBox.classList.add('hidden');
        feedbackBox.innerHTML = '';
      }
    }
  }

  handleSelectOption(optIdx) {
    if (this.userAnswers[this.currentQuestionIndex] !== undefined) return;

    const q = this.questions[this.currentQuestionIndex];
    const isCorrect = q.options[optIdx].isCorrect;

    this.userAnswers[this.currentQuestionIndex] = optIdx;
    if (isCorrect) {
      this.score++;
    }

    this.renderQuestion();
    this.updateProgressBar();
  }

  renderResults() {
    const questionBox = document.getElementById('quizActiveQuestionContainer');
    const resultsBox = document.getElementById('quizResultsContainer');
    if (questionBox) questionBox.classList.add('hidden');
    if (!resultsBox) return;

    resultsBox.classList.remove('hidden');

    const total = this.questions.length;
    const percent = Math.round((this.score / total) * 100);

    let rankTitle = 'ქიმიის ახალგაზრდა მკვლევარი';
    let rankBadgeColor = 'text-sky-400 bg-sky-950/60 border-sky-500/40';
    let encouragement = 'კარგი დასაწყისია! გადახედეთ თეორიულ ნაწილს და სცადეთ სიმულაციებით კიდევ ერთხელ ექსპერიმენტირება.';

    if (this.score === total) {
      rankTitle = '🏆 ქიმიური წონასწორობისა და კინეტიკის დიდოსტატი';
      rankBadgeColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      encouragement = 'ფენომენალური შედეგია! თქვენ სრულყოფილად ფლობთ დაჯახებათა თეორიას, ლე შატელიეს პრინციპსა და რაოდენობრივ გამოთვლებს 10-ე კლასის ეროვნული სასწავლო გეგმის უმაღლეს დონეზე.';
    } else if (this.score >= 5) {
      rankTitle = '⚛️ ქიმიური კინეტიკის ექსპერტი';
      rankBadgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      encouragement = 'ძალიან კარგი შედეგია! თქვენ მყარად გესმით რეაქციის სიჩქარეზე მოქმედი ფაქტორები, წონასწორობის გადახრის ლოგიკა და რაოდენობრივი ამოცანების ამოხსნა.';
    }

    resultsBox.innerHTML = `
      <div id="certificate-print-area" class="glass-panel p-8 text-center border border-sky-500/30 rounded-2xl">
        <div class="inline-block px-4 py-1.5 rounded-full border text-sm font-bold mb-4 ${rankBadgeColor}">
          ${rankTitle}
        </div>
        <h3 class="text-3xl font-extrabold text-white mb-2">ტესტირების შედეგები</h3>
        <p class="text-slate-400 text-sm mb-6">საქართველოს ეროვნული სასწავლო გეგმა (ესგ) | ქიმია X კლასი</p>

        <div class="flex items-center justify-center gap-8 my-6">
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span class="block text-4xl font-extrabold text-sky-400">${this.score} / ${total}</span>
            <span class="text-xs text-slate-400">სწორი პასუხი</span>
          </div>
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span class="block text-4xl font-extrabold text-emerald-400">${percent}%</span>
            <span class="text-xs text-slate-400">შესრულების სიზუსტე</span>
          </div>
        </div>

        <p class="text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">${encouragement}</p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <button onclick="window.print()" class="btn-primary">
            🖨️ სერტიფიკატის ამობეჭდვა / PDF შენახვა
          </button>
          <button id="btnRestartQuizInsideResults" class="btn-secondary">
            🔄 ტესტის თავიდან გავლა
          </button>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500">
          სერტიფიკატი გაცემულია სასწავლო-კვლევითი ინტერაქციული ლაბორატორიის მიერ. არ შეიცავს პერსონალურ მონაცემებს.
        </div>
      </div>
    `;

    const btnRestart = document.getElementById('btnRestartQuizInsideResults');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = {};
        resultsBox.classList.add('hidden');
        if (questionBox) questionBox.classList.remove('hidden');
        this.renderQuestion();
        this.updateProgressBar();
      });
    }
  }
}

window.QuizModule = QuizModule;
