import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const res = await api.get('/foods');
      setFoods(res.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const { data } = await api.post('/foods', food);
      setFoods([...foods, data]);
    } catch (err) {
      console.log(err);
    }
  }

  //https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-food/food3.png

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    const { data } = await api.put<IFoodPlate>(`/foods/${editingFood.id}`, { ...food, available: true });
    const index = foods.findIndex(v => v.id === editingFood.id);
    let copyFoods = [...foods];
    copyFoods[index] = data;
    setFoods(copyFoods);
  }

    async function handleDeleteFood(id: number): Promise<void> {
      await api.delete(`/foods/${id}`);
      setFoods(foods.filter(v => v.id !== id));
    }

    function toggleModal(): void {
      setModalOpen(!modalOpen);
    }

    function toggleEditModal(): void {
      setEditModalOpen(!editModalOpen);
    }

    function handleEditFood(food: IFoodPlate): void {
      setEditingFood(food);
      toggleEditModal();
    }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  };

  export default Dashboard;
