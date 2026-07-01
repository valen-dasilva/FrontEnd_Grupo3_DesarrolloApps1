import { Provincia } from '@/types/itinerario';

interface ProvinciaInfo {
  descripcion: string;
}

export const PROVINCIAS_INFO: Record<string, ProvinciaInfo> = {
  [Provincia.BUENOS_AIRES]: {
    descripcion:
      'La provincia más poblada de Argentina rodea —sin incluir— a la Ciudad Autónoma de Buenos Aires. Sus costas atlánticas concentran los balnearios más populares del país: Mar del Plata, Pinamar y Villa Gesell reciben millones de turistas cada verano. El Delta del Tigre, laberinto de ríos e islas que cubre más de 14.000 km², funciona como los pulmones verdes del área metropolitana. Las estancias bonaerenses ofrecen polo, asado y el horizonte infinito de la pampa húmeda en una experiencia de campo que pocas provincias pueden igualar.',
  },
  [Provincia.CABA]: {
    descripcion:
      'Buenos Aires es la capital federal y el motor cultural del Cono Sur, con 48 barrios de personalidad propia. El Teatro Colón es considerado uno de los cinco mejores teatros de ópera del mundo por su acústica excepcional. La Avenida 9 de Julio, la más ancha del planeta con 16 carriles, parte la ciudad de norte a sur custodiada por el Obelisco. Cada fin de semana la Feria de San Telmo convierte las calles empedradas en un mercado donde el tango y la historia se mezclan con el olor a café y medialunas.',
  },
  [Provincia.CATAMARCA]: {
    descripcion:
      'Catamarca esconde algunos de los paisajes más extremos de Argentina: el Campo de Piedra Pómez es un mar de roca volcánica blanca a más de 4.000 metros de altura que parece sacado de otro planeta. El Volcán Galán, uno de los más activos de la región, y las lagunas de altura con flamencos rosados completan un escenario irreal. Los sitios arqueológicos diaguitas revelan siglos de cultura prehispánica en los valles precordilleranos. Las artesanías en cerámica negra brillante y el tejido en lana de llama son expresiones únicas que no se consiguen en ningún otro rincón del país.',
  },
  [Provincia.CHACO]: {
    descripcion:
      'El Chaco alberga el Gran Impenetrable, el bosque seco subtropical más extenso de América del Sur y último refugio significativo del yaguareté en Argentina. Sus humedales son un paraíso para observar más de 400 especies de aves, incluyendo el ciervo de los pantanos y el carpintero negro. Resistencia es conocida como la "Ciudad de las Esculturas" con más de 600 obras en plena vía pública, sin rejas ni vigilancia. El quebracho colorado, madera tan densa que se hunde en el agua, fue el motor económico de la provincia durante más de un siglo y todavía da nombre a muchos parajes del interior.',
  },
  [Provincia.CHUBUT]: {
    descripcion:
      'La Península Valdés, Patrimonio de la Humanidad, recibe cada año entre junio y diciembre ballenas francas australes que llegan a reproducirse en sus aguas protegidas. Las playas de Punta Tombo albergan la mayor colonia continental del mundo de pingüinos de Magallanes, con más de un millón de individuos. Puerto Madryn fue el primer asentamiento galés en la Patagonia en 1865, y la tradición del té con torta negra sigue viva en los valles del Chubut. La estepa patagónica con guanacos y zorros grises se extiende bajo cielos que parecen más anchos que en cualquier otro lugar del país.',
  },
  [Provincia.CORDOBA]: {
    descripcion:
      'Córdoba es la segunda ciudad más grande de Argentina y tiene la mayor concentración estudiantil del país, lo que le da una energía joven e inigualable. Las Sierras Chicas y Grandes ofrecen ríos, diques y pueblos pintorescos a solo una hora del centro urbano. La Manzana Jesuítica, con su iglesia colonial del siglo XVII y las estancias rurales, es Patrimonio de la Humanidad desde el año 2000. La noche cordobesa es legendaria en todo el país, y el acento propio de sus habitantes —con el "che" y el "bo"— es inconfundible desde Jujuy hasta Tierra del Fuego.',
  },
  [Provincia.CORRIENTES]: {
    descripcion:
      'Los Esteros del Iberá son uno de los humedales más grandes del mundo, reserva de biosfera donde se reintroducen especies extintas como el yaguareté y el oso hormiguero. Carpinchos, caimanes yacarés y más de 350 especies de aves hacen de los esteros un safari sudamericano sin comparación. El carnaval correntino, con sus comparsas y el ritmo inconfundible del chamamé, es una de las fiestas populares más intensas del interior del país. El surubí y el dorado del río Paraná a la parrilla son un ritual gastronómico sagrado en cada rincón de la provincia.',
  },
  [Provincia.ENTRE_RIOS]: {
    descripcion:
      'Entre Ríos es la única provincia de Argentina completamente rodeada por ríos: el Paraná al oeste y el Uruguay al este la abrazan y dan forma a su identidad ribereña. Sus termas son las más desarrolladas del país, con complejos en Federación, Colón y Concordia donde el agua caliente mineral emerge naturalmente del subsuelo. El Carnaval de Gualeguaychú es el más largo y espectacular de Argentina, con comparsas de miles de bailarines que compiten durante meses. Las costas del Paraná forman playas de arena fina en pleno interior continental, rodeadas de sauces llorones y fauna acuática.',
  },
  [Provincia.FORMOSA]: {
    descripcion:
      'Formosa tiene la mayor superficie de humedales de Argentina y comparte con Paraguay uno de los ecosistemas más ricos y menos conocidos del continente. El Parque Nacional Río Pilcomayo, con sus lagunas estacionales, alberga yacarés, anacondas y una concentración extraordinaria de aves acuáticas. Las comunidades wichí, qom y pilagá mantienen vivas sus tradiciones: el tejido en fibra de chaguar, planta silvestre del monte, produce piezas únicas en el mundo. Sus veranos con más de 45°C y humedad extrema crean uno de los climas más intensos de la Argentina, que moldea un paisaje salvaje sin igual.',
  },
  [Provincia.JUJUY]: {
    descripcion:
      'La Quebrada de Humahuaca, Patrimonio de la Humanidad, atraviesa Jujuy con montañas de colores rojizos, amarillos y verdes que cambian según la hora del día y la estación. El pueblo de Purmamarca, con el Cerro de los Siete Colores de fondo, es una de las postales más fotografiadas de la Argentina. A 3.400 metros de altura, la Laguna de los Pozuelos es reserva de biosfera y hogar simultáneo de tres especies de flamencos. El carnaval jujeño, con el desentierro del diablo y el cachi-cachi, mezcla tradición andina y española en una fiesta que dura semanas enteras.',
  },
  [Provincia.LA_PAMPA]: {
    descripcion:
      'El Parque Nacional Lihué Calel esconde sierras volcánicas de 500 millones de años en medio de la llanura, con pinturas rupestres y pumas que todavía rondan libremente por sus quebradas. Los bosques de caldenes, árboles endémicos que soportan heladas de −20°C y veranos de 40°C, forman un ecosistema que no existe en ningún otro lugar del mundo. La provincia es la capital ganadera de la Argentina profunda: estancias que producen carne de exportación en campos sin límite a la vista. En temporada, el ciervo colorado europeo convive con el guanaco y el mara patagónico en una mezcla de fauna local e introducida que define el paisaje pampeano actual.',
  },
  [Provincia.LA_RIOJA]: {
    descripcion:
      'El Parque Nacional Talampaya, Patrimonio de la Humanidad junto con el vecino Ischigualasto, exhibe cañones rojizos de hasta 180 metros esculpidos durante millones de años, con pinturas rupestres y fósiles de 250 millones de años de antigüedad. El vino torrontés riojano, floral y aromático, es una de las variedades más características del noroeste argentino. Las serranías del Famatina superan los 6.000 metros y albergan glaciares de roca y cóndores en permanente vigilia. Los pueblos de Chilecito y Villa Unión son la puerta de una provincia que guarda el alma diaguita en cada pircado y petroglifo de sus quebradas.',
  },
  [Provincia.MENDOZA]: {
    descripcion:
      'Mendoza produce el 70% del vino argentino y es la cuna del Malbec que conquistó los mercados del mundo. Más de 1.200 bodegas se distribuyen entre valles regados por deshielo andino, con un microclima excepcional que concentra los aromas de la uva. El Aconcagua (6.961 m) es el pico más alto del hemisferio occidental y convoca alpinistas de todo el planeta. Las termas de Cacheuta, el rafting en el río Mendoza y el ski en Las Leñas completan una oferta de aventura que no para en ninguna estación del año.',
  },
  [Provincia.MISIONES]: {
    descripcion:
      'Misiones alberga las Cataratas del Iguazú, una de las Siete Maravillas Naturales del Mundo, con más de 275 saltos de agua que se extienden 2,7 km en la frontera con Brasil. La provincia está casi enteramente cubierta por selva subtropical y forma parte de la Reserva de la Biósfera Yabotí. Las ruinas jesuíticas de San Ignacio Mini, con sus piedras rojas cubiertas de musgo, son Patrimonio de la Humanidad. La fauna incluye tucanes, yacares, monos caí y, con mucha suerte, yaguaretés que aún rondan la selva misionera.',
  },
  [Provincia.NEUQUEN]: {
    descripcion:
      'Neuquén es la capital paleontológica del mundo: el Patagotitan mayorum, el dinosaurio más grande que existió sobre la Tierra, fue descubierto aquí en los yacimientos de Villa El Chocón. El Parque Nacional Lanín, con su volcán simétrico nevado de 3.776 metros, ofrece una Patagonia verde y lacustre a pocas horas de Buenos Aires. La Ruta de los Siete Lagos conecta San Martín de los Andes con Bariloche atravesando un paisaje de bosques andinos y espejos de agua que cambia de color con cada estación. El ski en Chapelco y el termalismo de Copahue completan una oferta que funciona los doce meses del año.',
  },
  [Provincia.RIO_NEGRO]: {
    descripcion:
      'Río Negro tiene dos caras perfectas: la Patagonia andina con Bariloche, el chocolate artesanal y los bosques milenarios de coihues, y la costa atlántica con Las Grutas y su agua templada que sorprende a quien no la conoce. El lago Nahuel Huapi, de aguas turquesas, forma el corazón del parque nacional más antiguo de Argentina, fundado en 1903. El Alto Valle produce las manzanas y peras que se exportan a Europa: sus chacras en flor durante octubre son una postal de primavera que pocos turistas conocen. El Bolsón, con su feria artesanal y su microclima suave, es la capital alternativa de la Patagonia con festivales de música y cerveza artesanal que duran todo el verano.',
  },
  [Provincia.SALTA]: {
    descripcion:
      'Salta, "la Linda", es una de las ciudades coloniales mejor conservadas de Argentina, con un casco histórico que convive con quebradas policromas como las de Cafayate y Humahuaca. El Tren a las Nubes asciende a 4.220 metros sobre el nivel del mar atravesando viaductos sobre el vacío en uno de los viajes más espectaculares del mundo. La cocina salteña es reconocida en todo el país: empanadas fritas, locro, humita y el torrontés de los valles calchaquíes son paradas obligadas. El Parque Nacional Los Cardones, con sus cardones milenarios que alcanzan los 10 metros, parece sacado de una película de otro mundo.',
  },
  [Provincia.SAN_JUAN]: {
    descripcion:
      'San Juan comparte con La Rioja el Parque Nacional Ischigualasto (Valle de la Luna), Patrimonio de la Humanidad, donde los vientos esculpen formaciones rocosas de 230 millones de años en un paisaje de otro planeta. La provincia produce el 80% del aceite de oliva de Argentina y sus uvas biodinámicas del Valle de Tulum generan vinos de altura cada vez más reconocidos en el mundo. El Paso de Agua Negra a 4.765 metros conecta con Chile a través de la cordillera sin asfalto, en uno de los pasos más altos de América del Sur. La cultura huarpe, que habitó la región durante milenios antes de la conquista española, puede rastrearse en museos y sitios arqueológicos de toda la provincia.',
  },
  [Provincia.SAN_LUIS]: {
    descripcion:
      'El microclima del Valle del Conlara y las Sierras de los Comechingones hace de Merlo un destino ideal prácticamente los 365 días del año, con 340 días de sol anuales. La transparencia del río Conlara en verano y los diques La Florida y Potrero de los Funes atraen a quienes buscan naturaleza sin multitudes. El Parque Nacional Sierra de las Quijadas, con sus cañones rojos y huellas de pterodáctilos impresas en la roca, permanece misteriosamente ignorado por el turismo masivo. La provincia tiene la tasa de criminalidad más baja del país, lo que la convierte en uno de los destinos más tranquilos y seguros de la Argentina.',
  },
  [Provincia.SANTA_CRUZ]: {
    descripcion:
      'El Parque Nacional Los Glaciares, Patrimonio de la Humanidad, alberga el Perito Moreno, el único glaciar del mundo que avanza en lugar de retroceder, con rupturas de hielo que hacen temblar el suelo ante miles de espectadores. El Monte Fitz Roy en El Chaltén, llamado "el cerro que humea" en mapuche, es uno de los trekking más desafiantes y espectaculares del planeta. Santa Cruz es la provincia más grande de Argentina y una de las menos densamente pobladas del mundo. Las colonias de pingüinos en la Ría Deseado y las ballenas frente a Puerto San Julián completan un cuadro de naturaleza salvaje e irreproducible.',
  },
  [Provincia.SANTA_FE]: {
    descripcion:
      'Rosario es la cuna simultánea de Ernesto "Che" Guevara y Lionel Messi, una concentración de íconos por metro cuadrado que ninguna otra ciudad del país puede igualar. El Monumento a la Bandera, frente al río Paraná, marca el lugar donde Manuel Belgrano izó por primera vez la enseña nacional en 1812. La costanera de Rosario, con sus playas sobre el Paraná, es uno de los paseos fluviales más democráticos y activos del país durante el verano. Los carnavales del interior santafesino y la gastronomía de tradición italiana y española que sobrevive en cada barrio hacen de la provincia un caleidoscopio cultural en miniatura.',
  },
  [Provincia.SANTIAGO_DEL_ESTERO]: {
    descripcion:
      'Santiago del Estero es la provincia más antigua de Argentina: fundada en 1553, es la "madre de ciudades" desde la que partieron los fundadores de Tucumán, Córdoba, La Rioja y Salta. Sus termas naturales, con temperaturas que superan los 40°C, son las más cálidas del país y atraen a miles de visitantes que buscan alivio en el agua mineromedicinal. La chacarera —con su bombo y su violín— nació en estos montes y fue declarada Patrimonio Cultural por la UNESCO como expresión del folklore argentino. Los bosques de quebracho blanco y el monte chaqueño crean un paisaje de espinas y silencios que guarda una belleza profunda y difícil de olvidar.',
  },
  [Provincia.TIERRA_DEL_FUEGO]: {
    descripcion:
      'Ushuaia es la ciudad más austral del mundo y el punto de partida para expediciones a la Antártida, el último continente silvestre del planeta. El Parque Nacional Tierra del Fuego, el único parque nacional costero de Argentina, une bosques de lengas, turbales y el Canal Beagle en un paisaje que Darwin describió con asombro en 1833. Los cruceros que rodean el Cabo de Hornos parten desde aquí, donde el Atlántico y el Pacífico se unen en aguas que durante siglos fueron las más temidas por los navegantes del mundo. Lobos marinos y pingüinos de Magallanes se dejan ver en las costas del canal a solo minutos del centro de la ciudad.',
  },
  [Provincia.TUCUMAN]: {
    descripcion:
      'Tucumán es la provincia más pequeña de Argentina pero quizás la más densa en historia: la Casa Histórica donde se firmó la Declaración de Independencia el 9 de julio de 1816 es el sitio patriótico más importante fuera de Buenos Aires. La región produce el 85% del limón de Argentina y el 15% de la producción mundial, convirtiendo sus valles en un mar amarillo durante la cosecha. Las yungas tucumanas, con su biodiversidad extraordinaria, cubren las laderas de las sierras y albergan tapires, pecaríes y tucanes del norte entre orquídeas y helechos gigantes. El cerro San Javier, a solo 15 minutos de la capital, sube 1.400 metros y ofrece una vista panorámica de los valles cultivados que alimentan al país.',
  },
};
