# sun.store Product Listing

Aplikacja stowrzona na potrzeby zadania rekrutacyjnego Sun.store. Aplikacja wyświetla produkty oraz umożliwia ich filtrowanie i sortowanie. Dane produktów są pobierane z pliku CSV znajdującego się w katalogu `server/assets/products.csv`.
Stan filtrów przechowywany jest w parametrach URL, dzięki czemu możliwe jest udostępnianie linków do konkretnych zestawów filtrów.

Wersja live: https://sunstore-dnowak.vercel.app/

# Local setup & requirements

Node.js: ^22.22.3, ^24.15.0, or >=26.0.0
npm: included with Node.js

npm install
npm run dev

# Architecture & data flow

Projekt wykorzystuje Nuxt 4, Vue 3 Composition API, TypeScript w trybie strict, endpointy Nitro oraz SCSS.

Parametry URL
Strona SSR i komponent ProductFilters
GET /api/products
Odczyt i parsowanie CSV (z cache)
Filtrowanie i sortowanie po stronie serwera
Renderowanie listy produktów i metadanych SEO

# Structure

app/pages/index.vue – pobieranie produktów oraz zarządzanie metadanymi SEO.
app/components/ProductFilters.vue – obsługa formularza filtrów i synchronizacja jego stanu z URL.
app/components/ProductCard.vue – prezentacja pojedynczego produktu.
server/api/products.get.ts – walidacja parametrów, wyszukiwanie, filtrowanie i sortowanie produktów.
server/api/manufacturers.get.ts – zwracanie posortowanej listy unikalnych producentów.
server/utils/products.ts – wczytanie, walidacja i mapowanie danych CSV oraz przechowywanie ich w pamięci serwera.
server/utils/specifications.ts – wyodrębnianie pojemności i mocy z opisów produktów.
shared/types/products.ts – typy współdzielone między frontendem i backendem.
app/assets/scss – globalne zmienne SCSS i breakpointy; style poszczególnych komponentów pozostają lokalne (scoped).

# Key decisions

Aplikacja jest renderowana wykorzystuje renderowanie serwerowe z uwagi na SEO.

Strona podczas pierwszego załadowania wykorzystuje UseFetch, dane są pobrane od razu dzięki czemu można ich użyć od razu do treści i SEO.
Lista producentów również pobierana jest podczas initial loadu, aby jak najszybciej spopulować dropdown manufacturer na liście filtrów.

Filtrowanie i sortowanie odbywa się po stronie serwera, zgodnie z wymaganiami. Plik CSV jest parsowany jednorazowo i trzymany w pamięci,
ponieważ każdorazowe przekształcanie go powodowałoby niepotrzebne opóźnienia, a 150 rekordów jest pomijalną ilością danych w kontekście performensu.
Jeżeli rozpatrywałbym możliwą ekspansje tego pliku do kilkuset tysięcy rekordów, wtedy należałoby rozważyć użycie zewnętrznej bazy danych.
//W przypadku tak małej ilości danych filtrowanie po stronie klienta nie powinno stanowić znaczącego problemu.

Podział na katalogi z racji na czas i skalę projektu jest ograniczony. W przypadku większej ilości wymagań rozdzieliłbym wyraźnie logikę biznesową od czystego UI.

# Parsowanie kWh i W – edge cases

Ponieważ dane z pliku CSV nie zawierają kolumn z wartościami mocy i pojemności, konieczne było wyłuskanie ich z kolumn description.
W tym celu z pomocą AI stworzyłem funkcje, która łuska wartości, a w przypadku braku zgodności jednostek przelicza je z kWh na Wh i z W na kW.
Obsługiwane warunki brzegowe:

- spacje między liczbą a jednostką np. 1 kWh i 1kWh
- różne wielkości liter
- brak wartości liczbowej zapisywany jest jako null i uwzględniany przy sortowaniu jako maksymalna wartość
- wartości ujemne lub ujemne oraz zakresy w których minimum jest większe od maksimum są odrzucane przez api oraz blokowane przez komponent filtrów

# Indeksowanie kombinacji filtrów

Indeksowanie wszystkich kombinacji filtrów powoduje rozdrobnienie i powstanie bardzo dużej ilości podstron o prawie identycznych parametrach.
Dobieranie kombinacji powinno się opierać o kluczowe keywordy jak np. Nazwa producenta i moc/pojemność.
W przeciwnym razie algorytmy np. Google'a mogą potrzebować więcej czasu na indeksowanie mało wartościowych adresów i kombinacje mające rzeczywistą wartość w generowaniu ruchu mogą otrzymać niższy priorytet, przez co mogą być wolniej odkrywane i indeksowane.

# Pominięte etapy oraz możliwe usprawnienia

- brak testów jednostkowych i integracyjnych z racji na czas i skalę
- brak paginacji i lazy loadingu. Na podstawie ograniczenia rozmiaru listy do 20 producentów zauważyłem, że lighthouse zwraca lepszy performance. Dlatego możliwym usprawnieniem byłaby tutaj forma virtual scrolla lub paginacji.
- SEO może być usprawnione, aby uniknąć dużej ilości niemal bliźniaczych stron.
- Dodanie stanów dla producentów oraz obsługi specyficznych błedów dla poprawy UX. Na razie jako że dane serwowane są z pamięci serwera, aplikacja działa bardzo szybko, więc UX nie cierpi na tym znacząco, jednak w przypadku zewnętrznej bazy danych jest to konieczne.

# Lightouse

Performance 91/100
Accessibility 100/100
Best Practices 100/100
SEO 100/100

First Contentful Paint (FCP) 2,8 s
Largest Contentful Paint (LCP) 2,8 s
Total Blocking Time (TBT) 0 ms
Cumulative Layout Shift (CLS) 0

# AI

W trakcie tworzenia projektu korzystałem z AI w znacznym stopniu. Początkowo wygenerowałem cały projekt z instrukcji zadania przy użyciu Codexa jako mvp. Funkcjonalności działały poprawnie, jednak kod nie był dla mnie zbyt czytelny.
Z tego powodu postanowiłem użyć mojego standardowego podejścia, czyli rozdzielenia zadania na iteracje z użyciem chataGPT z połączeniu z generacją query do codexa.
Nie jest to najszybsze rozwiązanie pod typowe delivery goals, ale pozwaliło mi to na lepsze zrozumienie kodu, oraz co miała na celu każda iteracja kodu. Niestety zarówno wersja mvp jak i dostarczyły kilka błędów, które musiałem wykluczyć granularnie.
Oprócz tego AI okazało się bardzo użyteczne przy konwersji jednostek oraz wygenerowaniu REGEX'a do łuskania danych z opisów, co byłoby dosyć czasochłonne z racji na moje braki w wiedzy specjalistycznej.

# Czas

Rozbicie zadania na mniejsze taski oraz analiza wygenerowanego kodu ok. 3h
Konfiguracja, debugowanie, deployment, napisanie readme ok. 1.5h
