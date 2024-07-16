const consolidateCardData = async () => {
    try {
      const response = await fetch('/api/cards');
      const cards = await response.json();
      const cardMap = {};
  
      cards.forEach(card => {
        const key = `${card.set}-${card.number}`;
        cardMap[key] = card;
      });
  
      return {
        cardMap,
        cards
      };
    } catch (error) {
      console.error('Error fetching card data:', error);
      return {
        cardMap: {},
        cards: []
      };
    }
  };
  
  export default consolidateCardData;
  